<?php

namespace App\Repositories;

use App\Repositories\Interfaces\PoolRepositoryInterface;

class PoolRepository implements PoolRepositoryInterface
{
    public function getPool()
    {
        try {
            $call = lgk_request('get', 'admin/pools', ['limit' => 9999, 'direction' => 'pool_name', 'order' => 'asc'], [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }
}
