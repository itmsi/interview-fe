<div class="row">
    <div class="col-12">
        @if (session()->has('message'))
            <p class="alert alert-success">{{ session('message') }}</p>
        @endif
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Banner</h3>
            </div>
            <!-- /.card-header -->
            <div class="card-body">
                <div class="row">
                    <div class="col-md-2">
                        <input type="text" class="form-control" wire:model.defer="filter.search"
                            placeholder="Keyword..." />
                    </div>
                    <div class="col-md-1">
                        <button type="button" class="btn btn-default" wire:click="searchData">Cari</button>
                    </div>
                    <div class="col-md-7 text-right">
                        @if (can('banner.create'))
                            <button type="button" class="btn btn-success" data-toggle="modal"
                                data-target="#add-banner-modal">
                                Tambah Banner
                            </button>
                        @endif
                    </div>
                </div>
                <hr />
                <div wire:loading wire:target="searchData">
                    Processing...
                </div>
                @include('includes._perpage')
                <div class="row" wire:loading.remove wire:target="searchData">
                    <div class="col-12">
                        <table id="tbl-banner" class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th wire:click.prevent="sortBy('title_banner')" role="button" href="#">Title Banner
                                        @include('includes._sort-icon', ['field' => 'title_banner'])</th>
                                    <th>File Banner</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($banners as $rowBanner)
                                    <tr>
                                        <td>{{ $rowBanner['title_banner'] }}</td>
                                        <td><img src="{{ asset('storage/' . $rowBanner['file_banner']) }}" alt="Banner"
                                                style="width: 100px; height: 100px;"></td>
                                        <td>
                                            @if (can('banner.update'))
                                                <button type="button" data-toggle="modal"
                                                    data-target="#edit-banner-modal"
                                                    wire:click="editBanner('{{ $rowBanner['banner_id'] }}')"
                                                    class="btn btn-warning" title="Edit Data"><i class="fa fa-edit"
                                                        style="color:white"></i></button>
                                            @endif
                                            @if (can('banner.delete'))
                                                <button type="button" data-toggle="modal"
                                                    data-target="#delete-banner-modal"
                                                    wire:click="deleteBanner('{{ $rowBanner['banner_id'] }}')"
                                                    class="btn btn-danger" title="Hapus Data"><i
                                                        class="fa fa-trash"></i></button>
                                            @endif
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="9">Belum ada data</td>
                                    </tr>
                                @endforelse

                            </tbody>

                        </table>
                    </div>
                </div>

                <div class="card-footer d-flex">
                    <div class="text-truncate mr-auto">
                        {{ $banners->links() }}
                    </div>
                    <div>
                        Showing {{ $banners->firstItem() }} to {{ $banners->lastItem() }} out of {{ $banners->total() }}
                        results
                    </div>
                </div>
                <!-- /.card-body -->
            </div>
        </div>

        @include('livewire.banner.modal')
        @include('livewire.banner.editmodal')
        @include('livewire.banner.deletemodal')
    </div>
    @push('scripts')
    @endpush
