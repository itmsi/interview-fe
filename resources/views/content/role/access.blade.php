<x-app-layout title="Atur Hak Akses">
    @slot('styles')
        <style>
            /* Hide the nested list */
            .nested {
                display: none;
            }

            /* Show the nested list when the user clicks on the caret/arrow (with JavaScript) */
            .active {
                display: block;
            }
        </style>
    @endslot
    <!-- Main content -->
    <section class="content">
        <div class="container-fluid">
            @if (\Session::has('validation'))
                <div class="row">
                    <div class="col-sm-12">
                        <p class="alert alert-danger">{{ \Session::get('validation') }}</p>
                    </div>
                </div>
            @endif
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Role Akses</h3>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="row">
                                        <div class="col-6 col-md-6 text-center">
                                            <strong>Nama Menu</strong>
                                        </div>
                                        <div class="col-6 col-md-6 text-center">
                                            <label><strong>Hak Akses</strong></label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12">
                                            <ul class="nav nav-pills" data-widget="treeview" role="rolemenu"
                                                data-accordion="false" id="roleMenuTreeview">
                                                <livewire:role-access :role_id="$id" />
                                            </ul>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                        <div class="card-footer text-muted">
                            <i>* Silakan logout dan login kembali untuk mendapatkan efek perubahan permission telah dilakukan.</i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </section>
    <!-- /.content-wrapper -->
    @slot('scripts')
        <script>
            var toggler = $("div").find(".caret");
            var i;
            for (i = 0; i < toggler.length; i++) {
                toggler[i].addEventListener("click", function() {
                    $(this).parent().parent().find('ul.nested').toggleClass('active')
                    $(this).find('i').toggleClass('fas fa-angle-down fas fa-angle-right')
                });
            }
        </script>
    @endslot
</x-app-layout>
