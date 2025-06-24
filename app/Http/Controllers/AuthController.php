<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Cookie;
use App\Helpers;

class AuthController extends Controller
{
    public function index(Request $req)
    {
        if ($req->isMethod('post')) {
            try {
                $username = $req->username;
                $password = $req->password;

                $data = [
                    'username' => $username,
                    'password' => $password,
                ];
                $login = lgk_request('postraw', 'auth/login', $data, [], 'api-gateway', true, false);
                if ($login) {
                    $access_token = $login['response']['data']['access_token'];
                    $refresh_token = $login['response']['data']['access_token'];
                    $expired_time = ($login['response']['data']['expires_in'] / 60); //menit

                    if ($req->has('remember')) {
                        $expires = 1440; // 24 jam
                    } else {
                        $expires = $expired_time; // one hours
                    }

                    Cookie::queue(Cookie::make('access_token', $access_token, $expires));
                    Cookie::queue(Cookie::make('refresh_token', $refresh_token, ($expires * 2)));

                    $permission = json_encode($login['response']['data']['system_access']);
                    $me = $login['response']['data'];
                    Cookie::queue(Cookie::make('me', json_encode($me), $expires));
                    $req->session()->put('permission', $permission);
                    session(['lifetime' => Config::get('session.lifetime')]);
                } else {
                    //return back();
                    return view('login', [
                        'username' => $username ?? '',
                    ]);
                }
            } catch (\Exception$e) {
                return _403($e->getMessage());
            }

            return redirect()->route('dashboard');
        }

        if (Cookie::get('access_token')) {
            return redirect()->route('dashboard');
        } else {
            return view('login');
        }
    }

    public function logout(Request $req)
    {
        $me = json_decode(Cookie::get('me'));
        if ($me) {
            Cache::forget('sidebar'.$me->userInfo->user->id); //remove cache sidebar
        }

        // revoke token first
        if (Cookie::get('access_token')) {
            try {
                lgk_request('get', 'auth/logout', [], [], 'api-gateway', true);
            } catch (\Exception $e) {
                // Log the error but continue with local logout
                Log::warning('Logout API call failed: ' . $e->getMessage());
                // Continue with local logout even if API fails
            }
        }

        Cookie::queue('access_token', null, -1);
        Cookie::queue('refresh_token', null, -1);
        Cookie::queue('me', null, -1);

        $req->session()->forget('permission');
        $req->session()->flush();

        return redirect()->route('auth.index');
    }

    public function changePassword(Request $req)
    {
        if ($req->isMethod('post')) {
            $password = $req->password;
            $oldpassword = $req->old_password;

            $validated = $req->validate([
                'old_password' => 'required|min:8',
                'password' => 'required|min:8',
                'password_confirmation' => 'required|same:password|min:8',
            ]);

            if ($validated) {
                $data = [
                    'password' => $password,
                    'old_password' => $oldpassword,
                ];

                $access_token = Cookie::get('access_token');
                $headers = ['Authorization' => 'Bearer '.$access_token];
                $changedPassword = lgk_request('postraw', 'admin/users/change-password', $data, $headers, 'api-gateway', true, false);

                if ($changedPassword) {
                    $callme = lgk_request('get', 'admin/me', [], $headers, 'api-gateway', true, false);
                    $permission = json_encode($callme['response']['data']['permissions']);
                    $req->session()->put('permission', $permission);

                    return back()->with('success', 'Update Password Success!');
                }
            } else {
                return back()->withInput()->withErrors($validated);
            }
        }

        return view('change-password');
    }
}
