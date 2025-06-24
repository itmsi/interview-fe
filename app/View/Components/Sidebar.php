<?php

namespace App\View\Components;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Request;
use Illuminate\View\Component;
use Illuminate\Support\Facades\Log;

class Sidebar extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public $menu = '';

    public function __construct()
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        try {
            $me = json_decode(Cookie::get('me'))->users_id;
            if (Cache::has('sidebar'.$me)) {
                $sidebar = Cache::get('sidebar'.$me);
            } else {
                $get = lgk_request('get', 'admin-menu');
                $sidebar = [];
                if ($get['status_code'] == 200) {
                    foreach ($get['response']->data as $row) {
                        $data = [
                            'id' => $row->menu_id,
                            'parent' => $row->parent,
                            'name' => $row->menu_name,
                            'icon' => $row->menu_icon,
                            'link' => $row->menu_url,
                        ];
                        array_push($sidebar, $data);
                    }
                    Cache::put('sidebar'.$me, $sidebar, $seconds = 1800);
                }
            }
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }

        $tree = $this->buildTreeMenu($sidebar);
        $menu = $this->buildMenu($tree);

        return view('layouts.sidebar', compact('menu'));
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
                $branch[$element['id']] = $element;
                unset($elements[$key]);
            }
        }

        return $branch;
    }

    public function buildMenu($arr)
    {
        foreach ($arr as $val) {
            if (! empty($val['children'])) {
                $open = Request::is($val['link'].'*') ? 'menu-open' : '';
                $active = Request::is($val['link'].'*') ? 'active' : '';
                $this->menu .= '<li class="nav-item '.$open.'">
                <a href="javascript:void(0)" class="nav-link '.$active.'">
                    <i class="nav-icon '.$val['icon'].'"></i>
                    <p>'.$val['name'].'
                    <i class="fas fa-angle-left right"></i></p></a>';

                $this->menu .= '<ul class="nav nav-treeview">';
                $this->buildMenu($val['children']);
                $this->menu .= '</ul></li>';
            } else {
                $active = Request::is($val['link']) ? 'active' : '';
                $this->menu .= '<li class="nav-item"><a href="'.url($val['link']).'" class="nav-link '.$active.'"><i class="nav-icon '.$val['icon'].'"></i><p>'.$val['name'].'</p></a></li>';
            }
        }

        return $this->menu;
    }
}
