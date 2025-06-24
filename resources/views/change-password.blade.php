<x-app-layout title="Ubah Kata Sandi">

    <!-- Main content -->
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <form action="{{ route('auth.change-password') }}" method="post">
                            {{ csrf_field() }}
                            <div class="modal-body">
                                @if (\Session::has('validation'))
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <p class="alert alert-danger">{{ \Session::get('validation') }}</p>
                                        </div>
                                    </div>
                                @endif
                                @if ($message = Session::get('success'))
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="alert alert-default-success alert-block">
                                            <button type="button" class="close" data-dismiss="alert">×</button>
                                            <strong>{{ $message }}</strong>
                                        </div>
                                    </div>
                                </div>
                                @endif
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-group">
                                            <label>Kata Sandi Lama</label>
                                            <input type="password" name="old_password"
                                                class="form-control" placeholder="">
                                            @error('old_password')
                                                <span class="text-danger">{{ $message }}</span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-group">
                                            <label>Kata Sandi Baru</label>
                                            <input type="password" name="password"
                                                class="form-control" placeholder="">
                                            @error('password')
                                                <span class="text-danger">{{ $message }}</span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-group">
                                            <label>Konfirmasi Kata Sandi Baru</label>
                                            <input type="password" name="password_confirmation"
                                                class="form-control" placeholder="">
                                            @error('password_confirmation')
                                                <span class="text-danger">{{ $message }}</span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12 text-right">
                                        <input type="submit" class="btn btn-success" value="Simpan"/>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </section>
</x-app-layout>
