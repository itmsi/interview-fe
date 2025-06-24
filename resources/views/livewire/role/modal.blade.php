<div wire:ignore.self class="modal fade" id="add-role-modal">
    <form wire:submit.prevent="saveRole">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Tambah Role</h4>
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
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group focused">
                                <label>Nama Role *</label>
                                <input type="text" class="form-control" wire:model.defer="item.role_name" placeholder="">
                                @error('item.role_name')
                                    <span class="text-danger">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </div>
        </div>
    </form>
</div>
