<?php

namespace App\Livewire;

use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Livewire\Attributes\On;
use Livewire\Component;
use Livewire\WithPagination;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Session;

class Role extends Component
{
    use WithPagination;

    protected $paginationTheme = 'bootstrap';

    public $page = 1;

    public $roleId;

    public $item = [];

    public $filter = [];

    public $search = '';

    public $sortField = 'created_at'; //default sort

    public $sortAsc = false;

    public $perPage = 10;

    public function resetInput()
    {
        $this->item = [];
    }

    protected function rules()
    {
        return [
            'item.role_name' => 'required|min:3',
        ];
    }

    protected $validationAttributes = [
        'item.role_name' => 'Role Name',
    ];

    public function sortBy($field)
    {
        if ($this->sortField === $field) {
            $this->sortAsc = ! $this->sortAsc;
        } else {
            $this->sortAsc = true;
        }

        $this->sortField = $field;

    }

    public function updated($fields)
    {
        $this->validateOnly($fields);
    }

    public function closeModal()
    {
        $this->resetInput();
    }

    public function saveRole()
    {
        $validatedData = $this->validate();
        $data = lgk_request('postraw', 'roles', $validatedData['item']);
        if ($data) {
            session()->flash('message', 'Role Berhasil ditambahkan.');
            $this->resetInput();
            $this->dispatch('close-modal');
        }
    }

    public function updateRole()
    {
        try {
            $validatedData = $this->validate();
            $data = lgk_request('put', 'roles/'.$this->roleId, $validatedData['item']);
            if ($data) {
                session()->flash('message', 'Data Berhasil diubah.');
                $this->resetInput();
                $this->dispatch('close-modal');
            }
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function editRole($id)
    {
        try {
            $roles = lgk_request('get', 'roles/'.$id, [], [], 'api-gateway', true);
            $data = $roles['response']['data'];
            $this->item = $data;
            $this->roleId = $id;
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function deleteRole($id)
    {
        $this->roleId = $id;
    }

    public function destroyRole()
    {
        $roles = lgk_request('delete', 'roles/'.$this->roleId);
        session()->flash('message', 'Data Berhasil dihapus.');
        $this->dispatch('close-modal');
    }

    public function searchData()
    {
        $this->resetPage();
    }

    public function render()
    {
        try {

            $param = [
                'direction' => $this->sortField,
                'order' => $this->sortAsc ? 'asc' : 'desc',
                'limit' => $this->perPage,
            ];

            if ($this->page !== 1) {
                $param = array_merge($param, ['page' => $this->page]);
            }

            if (count($this->filter) > 0) {
                if (isset($this->filter['search']) && $this->filter['search'] != '') {
                    $param = array_merge($param, ['search' => $this->filter['search']]);
                }
            }

            $call = lgk_request('get', 'roles', $param, [], 'api-gateway', true);

            $total = $call['response']['_meta']['count_total'];
            $data = $call['response']['data'];
            $per_page = $call['response']['_meta']['limit_per_page'];
            $current_page = $call['response']['_meta']['page'];
            $paginator = new Paginator($data, $total, $per_page, $current_page, [
                'path' => \Request::url(),
                'query' => [
                    'page' => $current_page,
                ],
            ]);
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }

        return view('livewire.role.index', [
            'roles' => $paginator,
        ]);
    }
}
