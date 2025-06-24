<div wire:ignore.self class="modal fade" id="add-banner-modal">
    <form wire:submit.prevent="saveBanner">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Tambah Banner</h4>
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
                        <label>Judul Banner *</label>
                        <input type="text" class="form-control" wire:model.defer="item.title_banner" placeholder="">
                        @error('item.title_banner')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>File Banner *</label>
                        <div wire:loading wire:target="item.file_banner">Uploading...</div>
                        <input type="file" wire:model="item.file_banner" class="form-control" placeholder=""
                            onchange="file_browse(this)">
                        @error('item.file_banner')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label>Link Banner</label>
                        <input type="text" class="form-control" wire:model.defer="item.link_banner" placeholder="">
                        @error('item.link_banner')
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
        function file_browse(e) {
            var max = 1024 * 1024 * 5;
            var ext = e.value.match(/\.([^\.]+)$/)[1];

            if (e.files && e.files[0].size > max) {
                alert("Sorry, Maximal file size image 5MB.");
                e.value = null;
            } else {
                switch (ext) {
                    case 'jpg':
                        break;
                    case 'jpeg':
                        break;
                    case 'png':
                        break;
                    default:
                        alert('only jpg/jpeg/png file that be allowed');
                        e.value = '';
                }
            }
        }
    </script>
@endpush
