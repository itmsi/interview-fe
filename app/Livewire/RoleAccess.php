<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\View;

class RoleAccess extends Component
{
    public $role_id;

    public $menu;

    protected $listeners = ['assignPermission'];

    public function assignPermission($permission_id, $menu_id, $value)
    {
        $data['permissions'] = [
            [
                'role_id' => $this->role_id,
                'permission_id' => $permission_id,
                'menu_id' => $menu_id,
                'checked' => $value,
            ],
        ];
        //update in database
        lgk_request('put', 'roles/assign-permissions/'.$this->role_id, $data);
    }

    public function list()
    {
        try {
            $get = lgk_request('get', 'admin-menu/access-list', ['role_id' => $this->role_id]);
            $access_list = [];
            if ($get) {
                foreach ($get['response']->data as $row) {
                    $data = [
                        'id' => $row->menu_id,
                        'parent' => $row->parent,
                        'name' => $row->menu_name,
                        'permission_id' => $row->permission_id,
                        'checked' => $row->checked,
                        'permission_name' => str_replace('_', ' ', $row->name),
                    ];
                    array_push($access_list, $data);
                }
            }
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
        $tree = $this->buildTreeMenu($access_list);
        $menu = $this->buildMenu($tree);

        return $menu;
    }

    public function buildTreeMenu($elements, $parentId = 0)
    {
        $branch = [];
        foreach ($elements as $key => $element) {
            if ($element['parent'] == $parentId) {
                $children = $this->buildTreeMenu($elements, $element['id']);
                if ($children) {
                    $element['children'] = $children;
                }
                if ($children) {
                    $branch[$element['id']] = $element;
                } else {
                    $branch[$element['name']][] = $element;
                }

                unset($elements[$key]);
            }
        }

        return $branch;
    }

    public function buildMenu($arr, $level = 0)
    {
        foreach ($arr as $key => $val) {
            if (! empty($val['children'])) {
                $level = 1;
                if ($val['parent'] == 0) {
                    $level = 0;
                }

                $checked = '';

                if ($val['checked'] == '1') {
                    $checked = 'checked="checked"';
                }

                $this->menu .= '<li class="nav-item col-12">
                <div class="row">
                    <div class="col-md-6 caret" style="padding-left: '.(3 * $level).'rem !important;">
                        <a href="javascript:void(0)" class="nav-link">
                            <i class="fas fa-angle-down"></i>
                            <label class="form-check-label">'.$val['name'].'</label>
                        </a>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group form-check form-check-label">
                            <input class="checkbox" data-menuid = '.$val['id'].' value="'.$val['permission_id'].'" type="checkbox" name="'.strtolower($val['permission_name']).'" '.$checked.'>
                                <label class="form-check-label mr-3">'.ucfirst($val['permission_name']).'</label>
                        </div>
                    </div>
                </div>';

                $this->menu .= '<ul class="nav nav-treeview nested active">';

                $this->buildMenu($val['children'], $level += 1);
                $this->menu .= '</ul></li>';
            } else {
                $this->menu .= '<li class="nav-item col-12">
                <div class="row">
                    <div class="col-md-6" style="padding-left: '.(3 * $level).'rem !important;">
                        <span class="nav-link">
                            <label class="form-check-label">'.$key.'</label>
                        </span>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group form-check form-check-label">';
                asort($val);
                foreach ($val as $row) {
                    $checked = '';
                    if ($row['checked'] == '1') {
                        $checked = 'checked="checked"';
                    }

                    $this->menu .= '<input class="checkbox" data-menuid = '.$row['id'].' value="'.$row['permission_id'].'" type="checkbox" name="'.strtolower($row['permission_name']).'" '.$checked.'>
                    <label class="form-check-label mr-5">'.ucfirst($row['permission_name']).'</label>';
                }

                $this->menu .= '</div>
                        </div>
                </li>';
            }
        }

        return $this->menu;
    }

    public function render()
    {
        $list = $this->list();

        return view('livewire.role.access', compact('list'));
    }
}
