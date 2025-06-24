<?php

namespace App\Livewire;

use App\Repositories\Interfaces\LocationRepositoryInterface;
use App\Repositories\RoleRepository;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Livewire\Component;
use Livewire\WithPagination;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\View;

class User extends Component
{
    use WithPagination;

    protected $paginationTheme = 'bootstrap';

    private LocationRepositoryInterface $locationRepository;

    private RoleRepository $roleRepository;

    public $userId;

    public $item = [];

    public $locations = [];

    public $roles = [];

    public $filter = [];

    public $ottPlatform = '';

    public $sortField = 'created_at'; //default sort

    public $sortAsc = false;

    public $perPage = 10;

    public $page = 1;

    public function hydrate()
    {
        $this->dispatch('loadSelect2');
        $this->resetValidation();
    }

    public function mount(LocationRepositoryInterface $locationRepository, RoleRepository $roleRepository)
    {
        $this->locationRepository = $locationRepository;
        $this->roleRepository = $roleRepository;
        $this->locations = $this->locationRepository->getLocation();
        $this->roles = $this->roleRepository->getRoles();
    }

    public function updated($field)
    {
        $this->validateOnly($field);
        if (str_contains($field, 'item.')) {
            $this->dispatch('loadSelect2');
        }
    }

    public function resetInput()
    {
        $this->item = [];
    }

    protected function rules()
    {
        return [
            'item.username' => 'required|alpha|min:3',
            'item.email' => 'required|email',
            'item.full_name' => 'required|regex:/^[\pL\s\-]+$/u',
            'item.role_id' => 'required',
            'item.location_id' => 'required',
            'item.jabatan' => 'required|string',
            'item.phone_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|min:10',
            'item.password' => 'required_with:item.password_confirmation|required_if:item.mode,add|min:6|confirmed',
            'item.password_confirmation' => 'required_with:item.password|required_if:item.mode,add|min:6',
            'item.status' => 'required',
        ];
    }

    public function sortBy($field)
    {
        if ($this->sortField === $field) {
            $this->sortAsc = ! $this->sortAsc;
        } else {
            $this->sortAsc = true;
        }

        $this->sortField = $field;
    }

    protected $validationAttributes = [
        'item.username' => 'Username',
        'item.email' => 'Email',
        'item.full_name' => 'Nama Lengkap',
        'item.role_id' => 'User Role',
        'item.location_id' => 'Cabang',
        'item.jabatan' => 'Jabatan',
        'item.phone_number' => 'No Handphone',
        'item.password' => 'Password',
        'item.password_confirmation' => 'Confirm Password',
        'item.status' => 'Status',
    ];

    public function closeModal()
    {
        $this->resetInput();
    }

    public function searchData()
    {
        $this->resetPage();
    }

    public function saveUser()
    {
        $validatedData = $this->validate();
        unset($validatedData['item']['password_confirmation']);
        $user = lgk_request('postraw', 'users', $validatedData['item'], [], 'api-gateway', true);

        if ($user) {
            Session::flash('message', 'Data Berhasil ditambahkan.');
            $this->resetInput();
            $this->dispatch('close-modal');
        }
    }

    public function updateUser()
    {
        $validatedData = $this->validate();
        unset($validatedData['item']['password_confirmation']);
        $user = lgk_request('put', 'users/'.$this->userId, $validatedData['item']);
        if ($user) {
            Session::flash('message', 'Data Berhasil diubah.');
            $this->resetInput();
            $this->dispatch('close-modal');
        }
    }

    public function editUser($id)
    {
        try {
            $user = lgk_request('get', 'users/'.$id, [], [], 'api-gateway', true);
            $data = $user['response']['data'];
            $this->item = $data;
            $this->userId = $id;
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function viewUser($id)
    {
        try {
            $user = lgk_request('get', 'users/'.$id, [], [], 'api-gateway', true);
            $data = $user['response']['data'];
            $this->item = $data;
            $this->userId = $id;
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function deleteUser($id)
    {
        $this->userId = $id;
    }

    public function destroyUser()
    {
        $client = lgk_request('delete', 'users/'.$this->userId);
        Session::flash('message', 'Data Berhasil dihapus.');
        $this->dispatch('close-modal');
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

                if (isset($this->filter['status']) && $this->filter['status'] != '') {
                    $param = array_merge($param, ['status' => $this->filter['status']]);
                }
            }
            $call = lgk_request('get', 'users', $param, [], 'api-gateway', true);

            $total = $call['response']['_meta']['count_total'];
            $data = $call['response']['data'];
            $per_page = $call['response']['_meta']['limit_per_page'];
            $current_page = $call['response']['_meta']['page'];
            $paginator = new Paginator($data, $total, $per_page, $current_page, [
                'path' => Request::url(),
                'query' => [
                    'page' => $current_page,
                ],
            ]);
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }

        return View::make('livewire.user.index', [
            'users' => $paginator,
            'locations' => $this->locations,
            'roles' => $this->roles,
        ]);
    }
}
