<?php

namespace App\Livewire;

use App\Repositories\Interfaces\LocationRepositoryInterface;
use App\Repositories\Interfaces\PoolRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Livewire\Component;
use Livewire\WithPagination;
use Illuminate\Support\Facades\Log;

class Dashboard extends Component
{
    use WithPagination;

    protected $paginationTheme = 'bootstrap';

    private LocationRepositoryInterface $locationRepository;

    private PoolRepositoryInterface $poolRepository;

    public $page = 1;

    public $filter = [];

    public $search = '';

    public $sortField = 'created_at'; //default sort

    public $sortAsc = false;

    public $perPage = 10;

    public $locations = [];

    public $pools = [];

    protected $listeners = ['getPool'];

    public function mount(LocationRepositoryInterface $locationRepository, PoolRepositoryInterface $poolRepository)
    {
        $this->locationRepository = $locationRepository;
        $this->locations = $this->locationRepository->getLocation();
        $this->poolRepository = $poolRepository;
    }

    public function getPool(LocationRepositoryInterface $locationRepository, $location_id)
    {
        $this->locationRepository = $locationRepository;
        $this->pools = $this->locationRepository->getPool($location_id);
    }

    public function hydrate()
    {
        $this->emit('loadSelect2');
        $this->resetValidation();
    }

    public function resetInput()
    {
        $this->item = [];
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
                'start_date' => date('Y-m-d'),
                'end_date' => date('Y-m-d'),
            ];

            if ($this->page !== 1) {
                $param = array_merge($param, ['page' => $this->page]);
            }

            if (count($this->filter) > 0) {
                if (isset($this->filter['location_id']) && $this->filter['location_id'] != '') {
                    $param = array_merge($param, ['location_id' => $this->filter['location_id']]);
                }
                if (isset($this->filter['pool_id']) && $this->filter['pool_id'] != '') {
                    $param = array_merge($param, ['pool_id' => $this->filter['pool_id']]);
                }
                if (isset($this->filter['start_date']) && $this->filter['start_date'] != '') {
                    $param = array_merge($param, ['start_date' => convert_format_tanggal_ymd($this->filter['start_date'])]);
                }
                if (isset($this->filter['end_date']) && $this->filter['end_date'] != '') {
                    $param = array_merge($param, ['end_date' => convert_format_tanggal_ymd($this->filter['end_date'])]);
                }
            }

            $call = lgk_request('get', 'dashboard', $param, [], 'api-gateway', true);
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

            $location = $this->locations;
            $pool = $this->pools;
            try {
                $this->filter['start_date'] = (! $this->filter['start_date']) ? date('d-m-Y') : $this->filter['start_date'];
            } catch (\Throwable $th) {
                $this->filter['start_date'] = date('d-m-Y');
            }
            try {
                $this->filter['end_date'] = (! $this->filter['end_date']) ? date('d-m-Y') : $this->filter['end_date'];
            } catch (\Throwable $th) {
                $this->filter['end_date'] = date('d-m-Y');
            }
        } catch (\Exception$e) {
            return _403($e->getMessage());
        }

        return view('livewire.dashboard.index', [
            'customers' => $paginator,
            'total' => $call['response']['_meta']['count_total'],
            'location' => $location,
            'pool' => $pool,
            'filter' => $this->filter,
        ]);
    }
}
