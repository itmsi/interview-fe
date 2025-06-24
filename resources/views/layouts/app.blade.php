<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title }}</title>
    <link rel="icon" href="{{ asset('favicon-new.ico') }}">
    <!-- Google Font: Source Sans Pro -->
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="{{ asset('plugins/fontawesome-free/css/all.min.css') }}">
    <!-- IonIcons -->
    <link rel="stylesheet" href="{{ asset('plugins/ionicons/ionicons.css') }}">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{ asset('dist/css/adminlte.min.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('plugins/pikaday/pikaday.css') }}">
    <link rel="stylesheet" href="{{ asset('plugins/select2/css/select2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('plugins/summernote/summernote-bs4.min.css') }}">
    {{ $styles }}
    @livewireStyles
</head>

<body class="hold-transition sidebar-mini layout-fixed layout-footer-fixed">
    <div class="wrapper">
        <x-navbar />
        <x-sidebar />
        <div class="content-wrapper">
            <!-- Content Header (Page header) -->
            <div class="content-header">
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-6">
                            <h1 class="m-0">{{ $breadcrumb }}</h1>
                        </div><!-- /.col -->
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item"><a href="{{ url('/') }}">Home</a></li>
                                <li class="breadcrumb-item active">{{ $breadcrumb }}</li>
                            </ol>
                        </div><!-- /.col -->
                    </div><!-- /.row -->
                </div><!-- /.container-fluid -->
            </div>
            <!-- /.content-header -->
            {{ $slot }}
        </div>
        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark">
            <!-- Control sidebar content goes here -->
        </aside>
        <!-- /.control-sidebar -->
        <!-- Main Footer -->
        <footer class="main-footer text-sm">
            <strong>Copyright &copy; 2022 <a href="#">{{ env('APP_NAME') }}</a>.</strong>
            All rights reserved.
            <div class="float-right d-none d-sm-inline-block">
                <b>Version</b> 1.0.0
            </div>
        </footer>
    </div>
    <!-- jQuery -->
    <script src="{{ asset('plugins/jquery/jquery.min.js') }}"></script>
    <script src="{{ asset('plugins/moment/moment.min.js') }}"></script>
    <script src="{{ asset('plugins/pikaday/pikaday.js') }}"></script>
    <!-- Bootstrap -->
    <script src="{{ asset('plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <!-- AdminLTE -->
    <script src="{{ asset('dist/js/adminlte.js') }}"></script>
    <script src="{{ asset('plugins/select2/js/select2.full.min.js') }}"></script>
    <script src="{{ asset('plugins/select2/js/select2-dropdownPosition.js') }}"></script>
    <script src="{{ asset('plugins/summernote/summernote-bs4.min.js') }}"></script>
    <script>
        var datepickers = document.querySelectorAll(".datepicker");
        var picker = [];
        var nowYear = new Date().getFullYear();
        var maxyear = nowYear + 5;
        for (var i = 0; i < datepickers.length; i++) {
            picker[i] = new Pikaday({
                field: datepickers[i],
                //format: 'YYYY-MM-DD'
                format: 'DD-MM-YYYY',
                yearRange: [1968, maxyear]
            })
        }

        //datepicker garis miring waktu berjalan
        var datepickers_garis_miring = document.querySelectorAll(".datepicker-garis-miring-waktu-berjalan");
        var picker_garis_miring = [];
        var nowYear = new Date().getFullYear();
        var maxyear = nowYear + 5;
        for (var i = 0; i < datepickers_garis_miring.length; i++) {
            picker_garis_miring[i] = new Pikaday({
                field: datepickers_garis_miring[i],
                format: 'DD/MM/YYYY',
                yearRange: [1968, maxyear],
                minDate: new Date(),
                disableDayFn: function(date) {
                    return date < new Date().setHours(0,0,0,0);
                }
            })
        }

        $(document).ready(function() {
            //load call
            $(".select2").select2({
                theme: 'bootstrap4',
                width: '100%',
                allowClear: true,
                placeholder: '--Pilih--',
                minimumResultsForSearch: 0
            });

            //waiting emit call
            window.Livewire.on('loadSelect2', () => {
                $(".select2").select2({
                    theme: 'bootstrap4',
                    width: '100%',
                    allowClear: true,
                    placeholder: '--Pilih--',
                    minimumResultsForSearch: 0
                });
            });

            $(".upper_text").keyup(function() {
                var valtext = $(this).val()
                $(this).val(valtext.toUpperCase())
            });
        });

        function numberToCurrency(a) {
            if (a != '' && a != null) {
                a = a.toString();
                var b = a.replace(/[^\d\.]/g, '');
                var dump = b.split('.');
                var c = '';
                var lengthchar = dump[0].length;
                var j = 0;
                for (var i = lengthchar; i > 0; i--) {
                    j = j + 1;
                    if (((j % 3) == 1) && (j != 1)) {
                        c = dump[0].substr(i - 1, 1) + ',' + c;
                    } else {
                        c = dump[0].substr(i - 1, 1) + c;
                    }
                }

                if (dump.length > 1) {
                    if (dump[1].length > 0) {
                        c += '.' + dump[1];
                    } else {
                        c += '.';
                    }
                }
                return c;
            } else {
                return '';
            }
        }
    </script>
    {{ $scripts }}
    @livewireScripts
    @stack('scripts')
</body>

</html>
