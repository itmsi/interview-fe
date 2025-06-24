<div wire:ignore.self class="modal fade" id="edit-banner-modal">
    <form wire:submit.prevent="updateBanner">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Edit Banner</h4>
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
                        <label>Judul Banner *</label>
                        <input type="text" class="form-control" wire:model.defer="item.title_banner" placeholder="">
                        @error('item.title_banner')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>File Banner *</label>
                        @if(isset($item['file_banner']) && !is_object($item['file_banner']))
                            <div class="mb-2">
                                <img src="{{ asset('storage/' . $item['file_banner']) }}" alt="Current Banner" class="img-thumbnail" style="max-height: 200px;">
                            </div>
                        @endif
                        <input type="file" class="form-control" wire:model="item.file_banner" accept="image/*,video/*">
                        @error('item.file_banner')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                        <small class="form-text text-muted">Format yang didukung: jpeg, png, jpg, gif, svg, video. Maksimal 2MB</small>
                    </div>
                    <div class="form-group">
                        <label>Link Banner</label>
                        <input type="text" class="form-control" wire:model.defer="item.link_banner" placeholder="">
                        @error('item.link_banner')
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
@endpush
