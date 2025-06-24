<div wire:ignore.self class="modal fade" id="add-user-modal">
    <form wire:submit.prevent="saveUser">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Tambah User</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    @if (\Session::has('validation'))
                        <div class="row">
                            <div class="col-sm-12">
                                <p class="alert alert-danger">{{ \Session::get('validation') }}</p>
                            </div>
                        </div>
                    @endif
                    <div class="form-group">
                        <label>Username *</label>
                        <input type="text" class="form-control" wire:model.defer="item.username" placeholder="">
                        @error('item.username')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="text" class="form-control" wire:model.defer="item.email" placeholder="">
                        @error('item.email')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>Nama Lengkap *</label>
                        <input type="text" class="form-control" wire:model.defer="item.full_name" placeholder="">
                        @error('item.full_name')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group" wire:ignore>
                        <label>User Role *</label>
                        <select id="role_id" class="form-control select2" wire:model.defer="item.role_id">
                            <option value="">--Pilih Role--</option>
                            @foreach ($roles as $role)
                                <option value="{{ $role['role_id'] }}">{{ $role['role_name'] }}</option>
                            @endforeach
                        </select>
                        @error('item.role_id')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group" wire:ignore>
                        <label>Cabang *</label>
                        <select id="location_id" class="form-control select2" wire:model.defer="item.location_id">
                            <option value="">--Pilih Cabang--</option>
                            @foreach ($locations as $location)
                                <option value="{{ $location['location_id'] }}">{{ $location['location_name'] }}</option>
                            @endforeach
                        </select>
                        @error('item.location_id')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>Jabatan *</label>
                        <input type="text" class="form-control" wire:model.defer="item.jabatan" placeholder="">
                        @error('item.jabatan')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>No. Handphone *</label>
                        <input type="text" class="form-control" wire:model.defer="item.phone_number" placeholder="">
                        @error('item.phone_number')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group" wire:ignore>
                        <label>Status *</label>
                        <select class="form-control select2" id="add-status" wire:model.defer="item.status">
                            <option value="">Pilih Status</option>
                            <option value="1">Aktif</option>
                            <option value="0">Tidak Aktif</option>
                        </select>
                        @error('item.status')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>Password *</label>
                        <input type="password" class="form-control" wire:model.defer="item.password" placeholder="">
                        @error('item.password')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>Ulangi Password *</label>
                        <input type="password" class="form-control" wire:model.defer="item.password_confirmation"
                            placeholder="">
                        @error('item.password_confirmation')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <input type="hidden" wire:model.defer="item.mode" value="add">

                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </div>
        </div>
    </form>
</div>
@push('scripts')
    <script>
        $(document).ready(function() {
            $("#role_id").on('change', function(e) {
                @this.set('item.role_id', this.value);
            });
            $("#location_id").on('change', function(e) {
                @this.set('item.location_id', this.value);
            });
            $("#add-status").on('change', function(e) {
                @this.set('item.status', this.value);
            });
        });
    </script>
@endpush
