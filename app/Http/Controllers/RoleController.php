<?php

namespace App\Http\Controllers;

class RoleController extends Controller
{
    public $menu;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('content.role.index');
    }

    public function access($id)
    {
        return view('content.role.access', [
            'id' => $id,
        ]);
    }
}
