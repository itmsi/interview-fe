<?php

namespace App\Repositories;

use App\Repositories\Interfaces\MasterRepositoryInterface;

class MasterRepository implements MasterRepositoryInterface
{
    public function getBankList()
    {
        try {
            $call = lgk_request('get', 'admin/banks', ['limit' => 9999, 'direction' => 'description', 'order' => 'asc'], [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getTypeClientList()
    {
        try {
            $call = lgk_request('get', 'admin/client-types', ['limit' => 9999, 'direction' => 'code', 'order' => 'asc'], [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getkategoriList()
    {
        try {
            $call = lgk_request('get', 'admin/category-faq', ['limit' => 9999, 'direction' => 'description', 'order' => 'asc'], [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getClientList($active = 0)
    {
        try {
            $param = ['limit' => 9999, 'direction' => 'first_name', 'order' => 'asc'];
            if ($active == 1) {
                $param = array_merge($param, ['status' => 1]);
            }
            $call = lgk_request('get', 'admin/clients', $param, [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getStatusInventory()
    {
        try {
            $call = lgk_request('get', 'admin/status-inventory',
                [
                    'limit' => 9999,
                    'direction' => 'status_name',
                    'order' => 'asc',
                ], [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getColor()
    {
        try {
            $call = lgk_request('get', 'admin/colors',
                [
                    'limit' => 9999,
                    'direction' => 'name',
                    'order' => 'asc',
                ], [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getCustomer($type = '')
    {
        try {
            $param = [
                'direction' => 'first_name',
                'order' => 'asc',
                'limit' => 9999,
            ];

            if ($type != '') {
                $param = array_merge($param, ['type' => $type]);
            }

            $call = lgk_request('get', 'admin/customers',
                $param, [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getClientListByAuction($type = 'car', $auction_id = '')
    {
        try {
            $param = [];
            if ($type != '') {
                $param = array_merge($param, ['type' => $type]);
            }
            if ($auction_id != '') {
                $param = array_merge($param, ['auction_id' => $auction_id]);
            }
            $call = lgk_request('postraw', 'admin/invoice-client-list', $param, [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getClientListByStatusInventory($active = 0, $type = '', $status = '')
    {
        try {
            $param = ['limit' => 9999, 'direction' => 'first_name', 'order' => 'asc'];
            if ($active == 1) {
                $param = array_merge($param, ['status' => 1]);
            }
            if ($type != '') {
                $param = array_merge($param, ['vehicle_type' => $type]);
            }
            if ($status != '') {
                $param = array_merge($param, ['inventory_status_id' => $status]);
            }
            $call = lgk_request('get', 'admin/clients', $param, [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getCustomerByAuction($auction_id = '')
    {
        try {
            $param = [
                'auction_id' => $auction_id,
            ];

            $call = lgk_request('get', 'admin/correction-nipl-offline-list-customer',
                $param, [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getCustomerAkunMonitoring()
    {
        try {
            $param = [
                'direction' => 'first_name',
                'order' => 'asc',
                'limit' => 9999,
            ];

            $call = lgk_request('get', 'admin/correction-monitoring-account',
                $param, [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getDataDebiturByKTP($ktp = '')
    {
        try {
            $param = [
                'limit' => '1',
                'page' => '1',
                'debitur_ktp_number' => $ktp ?? '',
            ];
            $call = lgk_request('get', 'admin/debitur', $param, [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }
}
