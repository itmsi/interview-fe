<div class="row">
    <div class="col-12">
        @if (session()->has('message'))
            <p class="alert alert-success">{{ session('message') }}</p>
        @endif
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">User</h3>
            </div>
            <!-- /.card-header -->
            <div class="card-body">
                <div class="row">
                    <div class="col-md-2" wire:ignore>
                        <select class="form-control select2" id="filter-status" wire:model.defer="filter.status">
                            <option value="">Pilih Status</option>
                            <option value="1">Aktif</option>
                            <option value="0">Tidak Aktif</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <input type="text" class="form-control" wire:model.defer="filter.search"
                            placeholder="Keyword..." />
                    </div>
                    <div class="col-md-1">
                        <button type="button" class="btn btn-default" wire:click="searchData">Cari</button>
                    </div>
                    <div class="col-md-7 text-right">
                        @if (can('users.create'))
                            <button type="button" class="btn btn-success" data-toggle="modal"
                                data-target="#add-user-modal">
                                Tambah User
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
                        <table id="tbl-user" class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th wire:click.prevent="sortBy('username')" role="button" href="#">Username
                                        @include('includes._sort-icon', ['field' => 'username'])</th>
                                    <th wire:click.prevent="sortBy('email')" role="button" href="#">Email
                                        @include('includes._sort-icon', ['field' => 'email'])</th>
                                    <th wire:click.prevent="sortBy('full_name')" role="button" href="#">Nama
                                        Lengkap @include('includes._sort-icon', ['field' => 'full_name'])</th>
                                    <th wire:click.prevent="sortBy('role_name')" role="button" href="#">Role
                                        @include('includes._sort-icon', ['field' => 'role_name'])</th>
                                    <th wire:click.prevent="sortBy('status')" role="button" href="#">Status
                                        @include('includes._sort-icon', ['field' => 'status'])</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($users as $user)
                                    <tr>
                                        <td>{{ $user['username'] }}</td>
                                        <td>{{ $user['email'] }}</td>
                                        <td>{{ $user['full_name'] }}</td>
                                        <td>{{ $user['role_name'] }}</td>
                                        <td>{{ convert_status($user['status']) }}</td>
                                        <td>
                                            @if (can('users.read'))
                                                <button type="button" data-toggle="modal"
                                                    data-target="#view-user-modal"
                                                    wire:click="viewUser('{{ $user['users_id'] }}')"
                                                    class="btn btn-primary" title="Detail Data"><i class="fa fa-eye"
                                                        style="color:white"></i></button>
                                            @endif
                                            @if (can('users.update'))
                                                <button type="button" data-toggle="modal"
                                                    data-target="#edit-user-modal"
                                                    wire:click="editUser('{{ $user['users_id'] }}')"
                                                    class="btn btn-warning" title="Edit Data"><i class="fa fa-edit"
                                                        style="color:white"></i></button>
                                            @endif
                                            @if (can('users.delete'))
                                                <button type="button" data-toggle="modal"
                                                    data-target="#delete-user-modal"
                                                    wire:click="deleteUser('{{ $user['users_id'] }}')"
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
                        {{ $users->links() }}
                    </div>
                    <div>
                        Showing {{ $users->firstItem() }} to {{ $users->lastItem() }} out of {{ $users->total() }}
                        results
                    </div>
                </div>
                <!-- /.card-body -->
            </div>
        </div>

        @include('livewire.user.modal')
        @include('livewire.user.editmodal')
        @include('livewire.user.viewmodal')
        @include('livewire.user.deletemodal')
    </div>
    @push('scripts')
        <script>
            $(document).ready(function() {
                $("#filter-status").on('change', function(e) {
                    @this.set('filter.status', this.value);
                });
            });
        </script>
    @endpush
