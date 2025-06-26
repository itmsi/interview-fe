<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cookie;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Debug cookie information
        $access_token = Cookie::get('access_token');
        $refresh_token = Cookie::get('refresh_token');
        $me = Cookie::get('me');
        
        $data = [
            'access_token' => $access_token ? 'Set' : 'Not Set',
            'refresh_token' => $refresh_token ? 'Set' : 'Not Set',
            'me' => $me ? $me : 'Not Set',
            'me_data' => $me ? json_decode($me, true) : null,
            'all_cookies' => request()->cookies->all(),
            'session_data' => session()->all()
        ];
        
        dd($data);
        Log::info('Dashboard accessed', $data);
        
        return view('content.dashboard', compact('data'));
    }
}
