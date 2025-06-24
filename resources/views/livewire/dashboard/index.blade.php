<div>
    <div class="row">
        <div class="col-12">
            @if (session()->has('message'))
                <p class="alert alert-success">{{ session('message') }}</p>
            @endif
        </div>
    </div>
    <br><br><br><br>

    @push('scripts')
    <script type="text/javascript">
        $("#start_date").change(function() {
            var start = $("#start_date").val().split("-").reverse().join("-");
            var end = $("#end_date").val().split("-").reverse().join("-");
            if (end != '') {
                if (start > end) {
                    alert('Tanggal awal harus lebih kecil dari tanggal akhir');
                    $("#start_date").val('');
                    $("#end_date").val('');
                    return false;
                }
            }
        });

        $("#end_date").change(function() {
            var start = $("#start_date").val().split("-").reverse().join("-");
            var end = $("#end_date").val().split("-").reverse().join("-");
            if (start > end) {
                alert('Tanggal awal harus lebih kecil dari tanggal akhir');
                $("#start_date").val('');
                $("#end_date").val('');
                return false;
            }
        });

        $(document).ready(function() {
            $("#list-location").on('change', function(e) {
                @this.set('filter.location_id', this.value);
                livewire.emit('getPool', this.value)
            });

            $("#pool_id").on('change', function(e) {
                @this.set('filter.pool_id', this.value);
            });
        });

        $('#searchData').click(function(){
            var list_location = $("#list-location").val();
            var start = $("#start_date").val();
            var end = $("#end_date").val();

            if (list_location == '') {
                alert('Lokasi silahkan dipilih');
                @this.set('filter.location_id', this.value);
                return false;
            } else if (start_date == '') {
                alert('Lokasi silahkan dipilih');
                return false;
            } else if (end_date == '') {
                alert('Lokasi silahkan dipilih');
                return false;
            }
        });
    </script>
    @endpush
</div>
