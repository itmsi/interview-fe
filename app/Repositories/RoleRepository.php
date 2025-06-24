<?php

namespace App\Repositories;

use App\Repositories\Interfaces\RoleRepositoryInterface;

class RoleRepository implements RoleRepositoryInterface
{
    public function getRoles()
    {
        try {
            $call = lgk_request('get', 'roles', ['limit' => 9999, 'direction' => 'role_name', 'order' => 'asc'], [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function getRole($id)
    {
        try {
            $call = lgk_request('get', 'roles/'.$id, [], [], 'api-gateway', true);

            return $call['response']['data'];
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }
}
