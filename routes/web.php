<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Middleware\EnsureTokenIsValid;
use Illuminate\Support\Facades\Cookie;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return redirect()->route('auth.index');
});

// Test route for debugging cookies
Route::get('/test-cookies', function () {
    $access_token = Cookie::get('access_token');
    $refresh_token = Cookie::get('refresh_token');
    $me = Cookie::get('me');
    
    return response()->json([
        'access_token' => $access_token ? 'Set' : 'Not Set',
        'refresh_token' => $refresh_token ? 'Set' : 'Not Set',
        'me' => $me ? 'Set' : 'Not Set',
        'me_data' => $me ? json_decode($me, true) : null,
        'all_cookies' => request()->cookies->all(),
        'session_data' => session()->all()
    ]);
});

// Test route to set cookies
Route::get('/set-test-cookie', function () {
    Cookie::queue(Cookie::make('test_cookie', 'test_value', 60));
    return response()->json(['message' => 'Test cookie set']);
});

// Test route to check API gateway configuration
Route::get('/test-api-gateway', function () {
    $api_gateway = env('API_GATEWAY');
    return response()->json([
        'api_gateway' => $api_gateway ?: 'Not Set',
        'app_env' => env('APP_ENV'),
        'app_debug' => env('APP_DEBUG')
    ]);
});

// Test route to simulate successful login and set cookies
Route::get('/test-login-simulation', function () {
    // Simulate successful login response
    $mock_login_data = [
        'access_token' => 'test_access_token_123',
        'refresh_token' => 'test_refresh_token_123',
        'expires_in' => 3600,
        'system_access' => ['dashboard', 'users'],
        'full_name' => 'Test User',
        'email' => 'test@example.com'
    ];
    
    $expires = 60; // 1 hour
    
    Cookie::queue(Cookie::make('access_token', $mock_login_data['access_token'], $expires));
    Cookie::queue(Cookie::make('refresh_token', $mock_login_data['refresh_token'], $expires * 2));
    Cookie::queue(Cookie::make('me', json_encode($mock_login_data), $expires));
    
    session(['permission' => json_encode($mock_login_data['system_access'])]);
    session(['lifetime' => config('session.lifetime')]);
    
    return response()->json([
        'message' => 'Mock login successful',
        'cookies_set' => [
            'access_token' => Cookie::get('access_token'),
            'refresh_token' => Cookie::get('refresh_token'),
            'me' => Cookie::get('me')
        ]
    ]);
});

Route::controller(AuthController::class)->name('auth.')->group(function () {
    Route::match(['get', 'post'], '/', 'index')->name('index');
    Route::get('/logout', 'logout')->name('logout');
    Route::match(['get', 'post'], '/change-password', 'changePassword')->name('change-password');
});

Route::middleware([EnsureTokenIsValid::class])->group(function () {
    Route::controller(DashboardController::class)->prefix('dashboard')->group(function () {
        Route::get('/', 'index')->name('dashboard');
    });
    Route::controller(DashboardController::class)->prefix('central-user')->group(function () {
        Route::get('/user-management', 'index');
        Route::get('/employee-management', 'index');
    });
    Route::controller(DashboardController::class)->prefix('interview')->group(function () {
        Route::get('/interview', 'index');
        Route::get('/candidate', 'index');
    });
    Route::controller(DashboardController::class)->prefix('payslip')->group(function () {
        Route::get('/wni', 'index');
        Route::get('/wna', 'index');
    });
});
