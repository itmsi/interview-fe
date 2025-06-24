<?php

namespace App\Livewire;

use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Livewire\Component;
use Livewire\WithPagination;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\View;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Log;

class Banner extends Component
{
    use WithPagination;
    use WithFileUploads;
    protected $paginationTheme = 'bootstrap';

    public $bannerId;

    public $item = [];

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

    public function mount()
    {}

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
            'item.title_banner' => 'required|string',
            'item.file_banner' => 'required|image|mimes:jpeg,png,jpg,gif,svg,video|max:2048',
            'item.link_banner' => 'nullable|string'
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
        'item.title_banner' => 'Judul Banner',
        'item.file_banner' => 'File Banner',
        'item.link_banner' => 'Link Banner',
    ];

    public function closeModal()
    {
        $this->resetInput();
    }

    public function searchData()
    {
        $this->resetPage();
    }

    public function saveBanner()
    {
        $validatedData = $this->validate();
        
        try {
            if (isset($this->item['file_banner'])) {
                $file = $this->item['file_banner'];
                $fileName = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('banners', $fileName, 'public');
                $this->item['file_banner'] = $path;
            }
        } catch (\Exception $e) {
            Log::error('File upload error: ' . $e->getMessage());
            return;
        }
        
        $banner = lgk_request('postraw', 'banner', $this->item, [], 'api-gateway', true);

        if ($banner) {
            Session::flash('message', 'Data Berhasil ditambahkan.');
            $this->resetInput();
            $this->dispatch('close-modal');
        }
    }

    public function updateBanner()
    {
        $validatedData = $this->validate();
        
        try {
            if (isset($this->item['file_banner'])) {
                $file = $this->item['file_banner'];
                $fileName = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('banners', $fileName, 'public');
                $this->item['file_banner'] = $path;
            }
        } catch (\Exception $e) {
            Log::error('File upload error: ' . $e->getMessage());
            return;
        }
        
        $banner = lgk_request('put', 'banner/'.$this->bannerId, $this->item);
        if ($banner) {
            Session::flash('message', 'Data Berhasil diubah.');
            $this->resetInput();
            $this->dispatch('close-modal');
        }
    }

    public function editBanner($id)
    {
        try {
            $banner = lgk_request('get', 'banner/'.$id, [], [], 'api-gateway', true);
            $data = $banner['response']['data'];
            $this->item = $data;
            $this->bannerId = $id;
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function viewBanner($id)
    {
        try {
            $banner = lgk_request('get', 'banner/'.$id, [], [], 'api-gateway', true);
            $data = $banner['response']['data'];
            $this->item = $data;
            $this->bannerId = $id;
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }
    }

    public function deleteBanner($id)
    {
        $this->bannerId = $id;
    }

    public function destroyBanner()
    {
        $client = lgk_request('delete', 'banner/'.$this->bannerId);
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
            $call = lgk_request('get', 'banner', $param, [], 'api-gateway', true);

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

        return View::make('livewire.banner.index', [
            'banners' => $paginator,
        ]);
    }
}
