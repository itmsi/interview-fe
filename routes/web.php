<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BannerController;
use App\Http\Middleware\EnsureTokenIsValid;

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

Route::controller(AuthController::class)->name('auth.')->group(function () {
    Route::match(['get', 'post'], '/', 'index')->name('index');
    Route::get('/logout', 'logout')->name('logout');
    Route::match(['get', 'post'], '/change-password', 'changePassword')->name('change-password');
});

Route::middleware([EnsureTokenIsValid::class])->group(function () {
    Route::controller(DashboardController::class)->prefix('dashboard')->group(function () {
        Route::get('/', 'index')->name('dashboard');
    });

    Route::controller(RoleController::class)->middleware(['role.permission:roles.read'])->prefix('management-user/roles')->name('roles.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/access/{id}', 'access')->name('access');
    });

    Route::controller(UserController::class)->middleware(['role.permission:users.read'])->prefix('management-user/users')->name('users.')->group(function () {
        Route::get('/', 'index')->name('index');
    });

    Route::controller(BannerController::class)->middleware(['role.permission:banner.read'])->prefix('master-data/banner')->name('banner.')->group(function () {
        Route::get('/', 'index')->name('index');
    });
});
