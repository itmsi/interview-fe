<?php

namespace App\Repositories;

use App\Repositories\Interfaces\LocationRepositoryInterface;
use Illuminate\Support\Facades\Log;

class LocationRepository implements LocationRepositoryInterface
{
    public function getLocation($type = '')
    {
        try {
            $param = [
                'direction' => 'location_name',
                'order' => 'asc',
                'limit' => 9999,
            ];

            if ($type != '') {
                $param = array_merge($param, ['location_type' => $type]);
            }

            $call = lgk_request('get', 'locations', $param, [], 'api-gateway', true);
            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getPool($location_id = '')
    {
        try {
            $param = [
                'direction' => 'pool_name',
                'order' => 'asc',
                'limit' => 9999,
                'show_seller' => 'yes',
            ];

            $param = array_merge($param, ['location_id' => $location_id]);

            $call = lgk_request('get', 'admin/pools', $param, [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getProvince()
    {
        try {
            $data = lgk_request('get', 'admin/option/province/', ['limit' => 9999], [], 'api-gateway', true);

            return $data['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getCity($province_id)
    {
        try {
            $data = lgk_request('get', 'admin/option/province/'.$province_id, [], [], 'api-gateway', true);

            return $data['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }
}
