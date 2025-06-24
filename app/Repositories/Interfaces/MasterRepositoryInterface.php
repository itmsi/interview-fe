<?php

namespace App\Repositories\Interfaces;

interface MasterRepositoryInterface
{
    public function getBankList();

    public function getClientList($active = 0);

    public function getkategoriList();

    public function getTypeClientList();

    public function getStatusInventory();

    public function getColor();

    public function getCustomer();

    public function getClientListByAuction($type, $auction_id);

    public function getClientListByStatusInventory($active, $type, $status);

    public function getCustomerByAuction($auction_id);

    public function getCustomerAkunMonitoring();

    public function getDataDebiturByKTP($ktp);
}
