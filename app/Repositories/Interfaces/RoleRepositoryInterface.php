<?php

namespace App\Repositories\Interfaces;

interface RoleRepositoryInterface
{
    public function getRoles();

    public function getRole($id);
}
