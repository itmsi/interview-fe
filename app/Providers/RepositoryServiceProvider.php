<?php

namespace App\Providers;

use App\Repositories\Interfaces\LocationRepositoryInterface;
use App\Repositories\Interfaces\MasterRepositoryInterface;
use App\Repositories\Interfaces\PoolRepositoryInterface;
use App\Repositories\LocationRepository;
use App\Repositories\MasterRepository;
use App\Repositories\PoolRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register(): void
    {
        $this->app->bind(LocationRepositoryInterface::class, LocationRepository::class);
        $this->app->bind(MasterRepositoryInterface::class, MasterRepository::class);
        $this->app->bind(PoolRepositoryInterface::class, PoolRepository::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot(): void
    {
        //
    }
}
