<?php

namespace App\Repositories\Interfaces;

interface LocationRepositoryInterface
{
    public function getLocation($type);

    public function getPool($location_id);

    public function getProvince();

    public function getCity($province_id);
}
