<?php

use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;

if (! function_exists('lgk_request')) {
    function lgk_request($method = null, $url = '', $data = [], $headers = [], $service = 'api-gateway', $assoc = false, $need_token = true)
    {
        $endpoint = [
            'api-gateway' => env('API_GATEWAY'),
        ];

        $url = $endpoint[$service].$url;

        if ($need_token) {
            $headers = array_merge($headers, ['Authorization' => 'Bearer '.Cookie::get('access_token')]);
        }

        $headers = array_merge($headers, [
            'RealIp' => request()->header('x-real-ip'),
            'X-Forwarded-For' => request()->header('x-forwarded-for'),
        ]);

        $client = new \GuzzleHttp\Client;

        try {
            if ($method === 'post') {
                $response = $client->post($url, [
                    'headers' => $headers,
                    'form_params' => $data,
                ]);
            } elseif ($method === 'postfiles') {
                $response = $client->post($url, [
                    'connect_timeout' => 10,
                    'headers' => $headers,
                    'multipart' => $data,
                ]);
            } elseif ($method === 'postraw') {
                $response = $client->request('POST', $url, [
                    'connect_timeout' => 10,
                    'headers' => $headers,
                    'json' => $data,
                ]);
            } elseif ($method === 'putfiles') {
                $response = $client->request('PUT', $url, [
                    'connect_timeout' => 10,
                    'headers' => $headers,
                    'multipart' => $data,
                ]);
            } elseif ($method === 'put') {
                $response = $client->request('PUT', $url, [
                    'connect_timeout' => 10,
                    'headers' => $headers,
                    'json' => $data,
                ]);
            } elseif ($method === 'delete') {
                $response = $client->request('DELETE', $url, [
                    'headers' => $headers,
                    'query' => $data,
                ]);
            } else {
                $response = $client->get($url, [
                    'headers' => $headers,
                    'query' => $data,
                ]);
            }
        } catch (\GuzzleHttp\Exception\ClientException$e) {
            if (env('APP_DEBUG') == true) {
                $status_code = $e->getResponse()->getStatusCode();
                if ($status_code === 401) {
                    // refresh_cookie();
                    return redirect()->route('auth.logout');
                } else {
                    return _403($e->getMessage());
                }
            } else {
                Log::channel('apicall')->info($e->getMessage());

                return _403(403, 'somthing wrong when call an API, call administrator');
            }
        }
        $status_code = $response->getStatusCode();
        $body = $response->getBody();

        if ($status_code == 200) {
            $status = json_decode($body);
            if (isset($status->status) && $status->status === false) {
                $arr = is_array($status->message);
                $err = $status->message;
                if ($arr) {
                    $err = $status->message[0];
                }

                session()->flash('validation', $err);

                return false;
            } else {
                $result = [
                    'status_code' => $status_code,
                    'response' => json_decode($body, $assoc),
                ];
            }
        } else {
            return _403($response->getBody());
        }

        return $result;
    }
}
if (! function_exists('refresh_cookie')) {
    function refresh_cookie()
    {
        if (! Cookie::get('refresh_token')) {
            return redirect()->route('auth.logout');
        } else {
            try {
                $refresh_token = Cookie::get('refresh_token');

                $refresh = lgk_request('get', 'admin/refresh-token', [], ['Authorization' => 'Bearer '.$refresh_token], 'api-gateway', true, false);

                $access_token = $refresh['response']['bearer_token'];
                $refresh_token = $refresh['response']['bearer_token'];
                $expired_time = ($refresh['response']['exp'] / 60); // menit

                Cookie::queue(Cookie::make('access_token', $access_token, $expired_time));
                Cookie::queue(Cookie::make('refresh_token', $refresh_token, ($expired_time * 2)));

                $headers = ['Authorization' => 'Bearer '.$access_token];
                $callme = lgk_request('get', 'admin/me', [], $headers, 'api-gateway', true, false);

                $me = $callme['response']['data'];
                $permission = json_encode($callme['response']['data']['permissions']);

                Cookie::queue(Cookie::make('me', json_encode($me), $expired_time));
                session()->put('permission', $permission);
                redirect()->route('dashboard');
            } catch (\GuzzleHttp\Exception\ClientException$e) {
                $status_code = $e->getResponse()->getStatusCode();
                if ($status_code === 401) {
                    return redirect()->route('auth.logout');
                } else {
                    return _403($e->getMessage());
                }
            }
        }
    }
}

if (! function_exists('format_currency')) {
    function format_currency($value)
    {
        return number_format($value);
    }
}

/* function check permission in blade */
if (! function_exists('can')) {
    function can($value)
    {
        $me = json_decode(\Cookie::get('me'));
        if ($me) {
            if ($me->role_name == 'Administrator') {
                return true;
            }
        }

        return in_array($value, json_decode(session('permission')));
    }
}

if (! function_exists('convert_status')) {
    function convert_status($value)
    {
        return ($value == 1) ? 'Aktif' : 'Tidak Aktif';
    }
}

if (! function_exists('convert_pay_method')) {
    function convert_pay_method($value)
    {
        if ($value == 1) {
            $return = 'BANK TRANSFER';
        } elseif ($value == 2) {
            $return = 'DEBIT';
        } elseif ($value == 3) {
            $return = 'CASH';
        } elseif ($value == 4) {
            $return = 'VIRTUAL ACCOUNT';
        } else {
            $return = '-';
        }

        return $return;
    }
}

if (! function_exists('convert_type_kendaraan')) {
    function convert_type_kendaraan($value)
    {
        if ($value == 'car') {
            $return = 'Mobil';
        } elseif ($value == 'bike') {
            $return = 'Motor';
        } else {
            $return = 'Mobil dan Motor';
        }

        return $return;
    }
}

if (! function_exists('convert_format_tanggal')) {
    function convert_format_tanggal($value)
    {
        return date('d-m-Y', strtotime($value));
    }
}

if (! function_exists('convert_menu_banner')) {
    function convert_menu_banner($value)
    {
        if ($value == '1') {
            $return = 'Beranda';
        } elseif ($value == '2') {
            $return = 'Iklan';
        } else {
            $return = 'Tentang Kami';
        }

        return $return;
    }
}

if (! function_exists('convert_format_tanggal_ymd')) {
    function convert_format_tanggal_ymd($value)
    {
        return date('Y-m-d', strtotime($value));
    }
}

if (! function_exists('convert_kondisi')) {
    function convert_kondisi($value)
    {
        return ($value == 1) ? 'Ya' : 'Tidak';
    }
}

if (! function_exists('convert_format_tanggal_dmy_his')) {
    function convert_format_tanggal_dmy_his($value)
    {
        if (($value === null) || ($value === '')) {
            return '00-00-0000: 00:00:00';
        }

        return date('d-m-Y H:i:s', strtotime($value));
    }
}

if (! function_exists('convert_format_waktu')) {
    function convert_format_waktu($value)
    {
        return date('H:i', strtotime($value));
    }
}
if (! function_exists('terbilang')) {
    function penyebut($nilai)
    {
        $nilai = abs($nilai);
        $huruf = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
        $temp = '';
        if ($nilai < 12) {
            $temp = ' '.$huruf[$nilai];
        } elseif ($nilai < 20) {
            $temp = penyebut($nilai - 10).' belas';
        } elseif ($nilai < 100) {
            $temp = penyebut($nilai / 10).' puluh'.penyebut($nilai % 10);
        } elseif ($nilai < 200) {
            $temp = ' seratus'.penyebut($nilai - 100);
        } elseif ($nilai < 1000) {
            $temp = penyebut($nilai / 100).' ratus'.penyebut($nilai % 100);
        } elseif ($nilai < 2000) {
            $temp = ' seribu'.penyebut($nilai - 1000);
        } elseif ($nilai < 1000000) {
            $temp = penyebut($nilai / 1000).' ribu'.penyebut($nilai % 1000);
        } elseif ($nilai < 1000000000) {
            $temp = penyebut($nilai / 1000000).' juta'.penyebut($nilai % 1000000);
        } elseif ($nilai < 1000000000000) {
            $temp = penyebut($nilai / 1000000000).' milyar'.penyebut(fmod($nilai, 1000000000));
        } elseif ($nilai < 1000000000000000) {
            $temp = penyebut($nilai / 1000000000000).' trilyun'.penyebut(fmod($nilai, 1000000000000));
        }

        return $temp;
    }

    function terbilang($nilai)
    {
        if ($nilai < 0) {
            $hasil = 'minus '.trim(penyebut($nilai));
        } else {
            $hasil = trim(penyebut($nilai));
        }

        return ucwords($hasil.' rupiah');
    }
}
if (! function_exists('metode_bayar')) {
    function metode_bayar($value)
    {
        if ($value == '1') {
            $return = 'Bank Transfer';
        } elseif ($value == '2') {
            $return = 'Cash';
        } elseif ($value == '3') {
            $return = 'Debit';
        } elseif ($value == '4') {
            $return = 'Virtual Account';
        } else {
            $return = '-';
        }

        return $return;
    }
}

if (! function_exists('convertNIPL')) {
    function convertNIPL($value, $type)
    {
        $nipls = explode(',', $value);
        $dataNipl = '';
        if ($type == 'Offline') {
            $kode = 'OF';
        } else {
            $kode = 'ON';
        }
        foreach ($nipls as $nipl) {
            $dataNipl .= $kode.$nipl.',';
        }
        $dataNipl = $dataNipl.'|';
        $dataNipl = str_replace(',|', '', $dataNipl);

        return $dataNipl;
    }
}

if (! function_exists('convert_null')) {
    function convert_null($value)
    {
        return ! empty($value) ? $value : '-';
    }
}

if (! function_exists('convert_format_tanggal_dmy')) {
    function convert_format_tanggal_dmy($value)
    {
        return date('d/m/Y', strtotime($value));
    }
}

if (! function_exists('convert_format_tanggal_garis_miring_dmyhis')) {
    function convert_format_tanggal_garis_miring_dmyhis($value)
    {
        $micro = explode('.', $value);
        $micro = ! empty($micro[1]) ? preg_replace('/[^0-9]/', '', $micro[1]) : 000;

        return date('d/m/Y H:i:s', strtotime($value)).'.'.$micro;
    }
}

if (! function_exists('convert_cancel_payment')) {
    function convert_cancel_payment($value)
    {
        return ($value) ? 'Batal' : '';
    }
}

if (! function_exists('convert_status_client')) {
    function convert_status_client($tgl_awal = '', $tgl_akhir = '')
    {
        $result = [];
        $dateExpired = convert_format_tanggal_ymd($tgl_akhir);
        $tgl1 = strtotime($tgl_awal);
        $tgl2 = strtotime($dateExpired);
        $jarak2 = $tgl2 - $tgl1;
        $hari = $jarak2 / 60 / 60 / 24;

        $result = [
            'status' => ($hari >= 0) ? 'Aktif' : 'Tidak Aktif', // untuk status client
            'jarakHari' => ($hari >= 0) ? $hari : 'Kontrak Selesai', // jarak hari
        ];

        return $result;
    }
}

if (! function_exists('convert_tanggal')) {
    function convert_tanggal($tgl, $type)
    {
        $tgl = date('Y-m-d', strtotime($tgl));
        $pecahkan = explode('-', $tgl);
        $hari = [1 => 'Senin',
            'Selasa',
            'Rabu',
            'Kamis',
            'Jumat',
            'Sabtu',
            'Minggu',
        ];
        $bulan = [
            1 => 'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ];

        $bulan_romawi = [
            1 => 'I',
            'II',
            'III',
            'IV',
            'V',
            'VI',
            'VII',
            'VIII',
            'IX',
            'X',
            'XI',
            'XII',
        ];
        if ($type == 'd') {
            $tgl = date('Y-m-N', strtotime($tgl));
            $pecahkan = explode('-', $tgl);
            $return = $hari[$pecahkan[2]];
        } elseif ($type == 'm') {
            $return = $bulan[(int) $pecahkan[1]];
        } elseif ($type == 'bulan_romawi') {
            $return = $bulan_romawi[(int) $pecahkan[1]];
        } elseif ($type == 'Y') {
            $return = $pecahkan[0];
        } else {
            $return = $pecahkan[2].' '.$bulan[(int) $pecahkan[1]].' '.$pecahkan[0];
        }

        return $return;
    }

    if (! function_exists('convert_garing_tanggal')) {
        // conver garis miring pada tanggal jika format tanggal dari api dd/mm/yyyy ss:ss:ss
        function convert_garing_tanggal($tanggal)
        {
            $dataTanggalWaktu = explode(' ', $tanggal);
            $dataTanggalArray = explode('/', $dataTanggalWaktu[0]);
            $tanggal = $dataTanggalArray[0].'-'.$dataTanggalArray[1].'-'.$dataTanggalArray[2];

            return $tanggal;
        }
    }

    if (! function_exists('format_angka')) {
        function format_angka($value)
        {
            return number_format($value, 0, ',', '.');
        }
    }

    if (! function_exists('convert_status_deposit')) {
        function convert_status_deposit($value)
        {
            $statusDeposit = '';
            if ($value == 0) {
                $statusDeposit = 'Batal';
            } elseif ($value == 1) {
                $statusDeposit = 'Belum diverifikasi';
            } elseif ($value == 2) {
                $statusDeposit = 'Terverifikasi';
            } elseif ($value == 3) {
                $statusDeposit = 'Dikembalikan';
            } elseif ($value == 4) {
                $statusDeposit = 'Belum Upload Bukti Bayar';
            } elseif ($value == 5) {
                $statusDeposit = 'Menunggu Pembayaran';
            }

            return $statusDeposit;
        }
    }

    if (! function_exists('format_npwp')) {
        function format_npwp($value)
        {
            $npwpArray = str_split($value);
            if (count($npwpArray) == 15) {
                $npwp = $npwpArray[0].$npwpArray[1].'.'.$npwpArray[2].$npwpArray[3].$npwpArray[4].'.'.$npwpArray[5].$npwpArray[6].$npwpArray[7].'.'.$npwpArray[8].'-'.$npwpArray[9].$npwpArray[10].$npwpArray[11].'.'.$npwpArray[12].$npwpArray[13].$npwpArray[14];
            } else {
                $npwp = $value;
            }

            return $npwp;
        }
    }

    if (! function_exists('jumlah_hari_kerja')) {
        function jumlah_hari_kerja($start_date, $end_date)
        {
            $start_date = date('Y-m-d', strtotime($start_date));
            $start_date = strtotime($start_date);
            $end_date = date('Y-m-d', strtotime($end_date));
            $end_date = strtotime($end_date);

            $hariKerja = [];
            for ($i = $start_date; $i <= $end_date; $i += (60 * 60 * 24)) {
                if (date('w', $i) !== '0' && date('w', $i) !== '6') {
                    $hariKerja[] = $i;
                }
            }
            $jumlahHariKerja = count($hariKerja);

            return ($jumlahHariKerja > 1) ? ($jumlahHariKerja - 1) : $jumlahHariKerja;
        }
    }

    if (! function_exists('convert_status_bpkb')) {
        function convert_status_bpkb($status, $value)
        {
            if ($status == 'Menyusul') {
                $status_bpkb = $value.' HK';
            } else {
                $status_bpkb = $status;
            }

            return $status_bpkb;
        }
    }

    if (! function_exists('status_hasil_lelang')) {
        function status_hasil_lelang($status, $dudate_payment, $payment_status, $is_cancel_wanprestasi)
        {
            if ($is_cancel_wanprestasi == true) {
                $return_status = 'WANPRESTASI';
            } else {
                if ($status == 'Terjual') {
                    if ($payment_status == false) {
                        $dudate_payment = date('Y-m-d H:i', strtotime($dudate_payment));
                        if ($dudate_payment <= date('Y-m-d').'16:00') {
                            $return_status = 'WANPRESTASI';
                        } else {

                            $return_status = 'SOLD';
                        }
                    } else {
                        $return_status = 'SOLD';
                    }
                } else {
                    $return_status = 'UNSOLD';
                }
            }

            return $return_status;
        }
    }

    if (! function_exists('get_condition_operator')) {
        function get_condition_operator($value)
        {
            $return = '';
            if ($value == 'gte') {
                $return = '≥';
            } elseif ($value == 'lte') {
                $return = '≤';
            }

            return $return;
        }
    }

    if (! function_exists('get_vehicle_type')) {
        function get_vehicle_type($value)
        {
            $return = '';
            if ($value == 'car') {
                $return = 'Mobil';
            } elseif ($value == 'bike') {
                $return = 'Motor';
            }

            return $return;
        }
    }

    if (! function_exists('get_ppn_dpp_static')) {
        function get_ppn_dpp_static($admin_fee)
        {
            // Check if admin_fee is numeric and convert to float
            $admin_fee = is_numeric($admin_fee) ? floatval($admin_fee) : 0;

            if ($admin_fee > 0) {
                $admin_sub_total = floor((($admin_fee / 1.11) * 11) / 100);
                $admin_ppn = $admin_fee - $admin_sub_total;
            } else {
                $admin_sub_total = 0;
                $admin_ppn = 0;
            }

            return [
                'admin_sub_total' => $admin_sub_total,
                'admin_ppn' => $admin_ppn,
            ];
        }
    }
}

if (! function_exists('_403')) {
    function _403($message = '')
    {
        abort(403, $message);
    }
}
if (! function_exists('_401')) {
    function _401($message = '')
    {
        abort(401, $message);
    }
}

if (! function_exists('abortTo')) {
    function abortTo($to = '/')
    {
        throw new \Illuminate\Http\Exceptions\HttpResponseException(redirect($to));
    }
}
