<div wire:ignore.self class="modal fade" id="edit-user-modal">
    <form wire:submit.prevent="updateUser">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Edit User</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" wire:click="closeModal">
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
                        <select id="edit-role_id" class="form-control select2" wire:model.defer="item.role_id">
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
                        <select id="edit-location_id" class="form-control select2" wire:model.defer="item.location_id">
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
                        <select class="form-control select2" id="edit-status" wire:model.defer="item.status">
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
                <input type="hidden" wire:model.defer="item.mode" value="edit">
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default" data-dismiss="modal"
                        wire:click="closeModal">Batal</button>
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    </form>
</div>
@push('scripts')
    <script>
        $(document).ready(function() {
            // Initialize Select2 for role dropdown
            $("#edit-role_id").select2({
                width: '100%',
                dropdownParent: $('#edit-user-modal')
            }).on('change', function(e) {
                @this.set('item.role_id', this.value);
            });

            // Initialize Select2 for location dropdown
            $("#edit-location_id").select2({
                width: '100%',
                dropdownParent: $('#edit-user-modal')
            }).on('change', function(e) {
                @this.set('item.location_id', this.value);
            });

            // Initialize Select2 for status dropdown
            $("#edit-status").select2({
                width: '100%',
                dropdownParent: $('#edit-user-modal')
            }).on('change', function(e) {
                @this.set('item.status', this.value);
            });

            // Listen for Livewire events to update Select2 values
            Livewire.on('editUser', (data) => {
                // Set values first
                $("#edit-role_id").val(data.role_id);
                $("#edit-location_id").val(data.location_id);
                $("#edit-status").val(data.status);

                // Then reinitialize Select2
                $("#edit-role_id").select2({
                    width: '100%',
                    dropdownParent: $('#edit-user-modal')
                });
                $("#edit-location_id").select2({
                    width: '100%',
                    dropdownParent: $('#edit-user-modal')
                });
                $("#edit-status").select2({
                    width: '100%',
                    dropdownParent: $('#edit-user-modal')
                });

                // Trigger change events
                $("#edit-role_id").trigger('change');
                $("#edit-location_id").trigger('change');
                $("#edit-status").trigger('change');
            });

            // Listen for modal open event
            $('#edit-user-modal').on('shown.bs.modal', function () {
                // Get current values from Livewire
                let roleId = @this.item.role_id;
                let locationId = @this.item.location_id;
                let status = @this.item.status;

                // Set values
                $("#edit-role_id").val(roleId);
                $("#edit-location_id").val(locationId);
                $("#edit-status").val(status);

                // Reinitialize Select2
                $("#edit-role_id").select2({
                    width: '100%',
                    dropdownParent: $('#edit-user-modal')
                });
                $("#edit-location_id").select2({
                    width: '100%',
                    dropdownParent: $('#edit-user-modal')
                });
                $("#edit-status").select2({
                    width: '100%',
                    dropdownParent: $('#edit-user-modal')
                });

                // Trigger change events
                $("#edit-role_id").trigger('change');
                $("#edit-location_id").trigger('change');
                $("#edit-status").trigger('change');
            });

            // Reset Select2 when modal is closed
            $('#edit-user-modal').on('hidden.bs.modal', function () {
                $("#edit-role_id").val('').trigger('change');
                $("#edit-location_id").val('').trigger('change');
                $("#edit-status").val('').trigger('change');
            });
        });
    </script>
@endpush
