<div class="row">
    <div class="col-12">
        @if (session()->has('message'))
            <p class="alert alert-success">{{ session('message') }}</p>
        @endif
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Role</h3>
            </div>
            @include('livewire.role.modal')
            @include('livewire.role.editmodal')
            @include('livewire.role.deletemodal')
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
                    <div class="col-md-9 text-right">
                        @if (can('roles.create'))
                            <button type="button" class="btn btn-success" data-toggle="modal"
                                data-target="#add-role-modal">
                                Tambah Role
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
                        <table id="tbl-role" class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th wire:click.prevent="sortBy('role_name')" role="button" href="#">Nama Role
                                        @include('includes._sort-icon', ['field' => 'role_name'])</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($roles as $role)
                                    <tr>
                                        <td>{{ $role['role_name'] }}</td>
                                        <td>
                                            @if (can('roles.update'))
                                                <button type="button" data-toggle="modal"
                                                    data-target="#edit-role-modal"
                                                    wire:click="editRole('{{ $role['role_id'] }}')"
                                                    class="btn btn-warning" title="Edit Data" {{ in_array($role['role_name'], ['Auction Officer', 'Inspection', 'Conductor']) ? 'disabled' : '' }} ><i class="fa fa-edit"
                                                        style="color:white"></i></button>
                                            @endif
                                            @if (can('roles.privilege'))
                                                <a href="{{ route('roles.access', $role['role_id']) }}"
                                                    class="btn btn-primary" title="Hak Akses"><i
                                                        class="fa fa-check"></i></a>
                                            @endif
                                            @if (can('roles.delete'))
                                                @if ($role['can_deleted'])
                                                    <button type="button" data-toggle="modal"
                                                        data-target="#delete-role-modal"
                                                        wire:click="deleteRole('{{ $role['role_id'] }}')"
                                                        class="btn btn-danger" title="Hapus Data"><i
                                                            class="fa fa-trash"></i></button>
                                                @endif
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
            </div>
            <div class="card-footer d-flex">
                <div class="text-truncate mr-auto">
                    {{ $roles->links() }}
                </div>
                <div>
                    Showing {{ $roles->firstItem() }} to {{ $roles->lastItem() }} out of {{ $roles->total() }}
                    results
                </div>
            </div>
            <!-- /.card-body -->
        </div>
    </div>
</div>
