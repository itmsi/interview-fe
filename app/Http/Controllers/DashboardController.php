<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        Log::info('test');
        $call = lgk_request('get', 'admin/dashboard', [], [], 'api-gateway', true);
        Log::info($call);
        return view('content.dashboard', [
            'customer' => $call['response'],
            'total' => $call['response'] ?? 0,
        ]);
    }
}
