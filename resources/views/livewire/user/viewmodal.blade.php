<div wire:ignore.self class="modal fade" id="view-user-modal">
    <form wire:submit.prevent="updateUser">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">View User</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" wire:click="closeModal">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" class="form-control" wire:model="item.username" placeholder="" disabled>
                        @error('item.username')
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="text" class="form-control" wire:model="item.email" placeholder="" disabled>
                        @error('item.email')
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>Nama Lengkap</label>
                        <input type="text" class="form-control" wire:model="item.full_name" placeholder="" disabled>
                        @error('item.full_name')
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group" wire:ignore>
                        <label>User Role</label>
                        <select class="form-control"  wire:model="item.role_id" disabled>
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
                        <label>Cabang</label>
                        <select class="form-control"   wire:model="item.location_id" disabled>
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
                        <label>Jabatan</label>
                        <input type="text" class="form-control" wire:model="item.jabatan" placeholder="" disabled>
                        @error('item.jabatan')
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>No. Handphone</label>
                        <input type="text" class="form-control" wire:model="item.phone_number" placeholder="" disabled>
                        @error('item.phone_number')
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select class="form-control" wire:model="item.status" disabled>
                            <option value="">Pilih Status</option>
                            <option value="1">Aktif</option>
                            <option value="0">Tidak Aktif</option>
                        </select>
                        @error('item.status')
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                </div>
                <input type="hidden" wire:model="item.mode" value="edit">
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default" data-dismiss="modal" wire:click="closeModal">Tutup</button>

                </div>
            </div>
        </div>
    </form>
</div>
