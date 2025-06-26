<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login | {{ env('APP_NAME') }}</title>
    <link rel="icon" type="image/png" href="{{ asset('/favicon-96x96.png') }}" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="{{ asset('/favicon.svg') }}" />
    <link rel="shortcut icon" href="{{ asset('/favicon.ico') }}" />
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('/apple-touch-icon.png') }}" />
    
    <link rel="stylesheet" href="{{ asset('assets/css/app.css') }}">
</head>

<body class="auth-body">
    <div class="loader-wrapper">
        <div class="loader">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <h4>Have a great day at work today <span>&#x263A;</span></h4>
        </div>
    </div>
    <div class="container-fluid">
        <div class="row align-items-center">
            <div class="col-lg-8 p-3 vh-100 overflow-hidden d-none d-md-block">
                <div class="w-100 h-100 rounded-4" style="background-image: url('{{ asset('assets/img/login.jpg') }}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                </div>
            </div>
            <div class="col-lg-4 px-lg-5 d-flex flex-column justify-content-center vh-100">
                <div class="w-100 text-center mb-4">
                    <img src="{{ asset('assets/img/motor-sights-international-text-white.png') }}" width="250" />
                </div>
                @if (\Session::has('validation'))
                    <div class="row">
                        <div class="col-sm-12">
                            <p class="alert alert-danger">{{ \Session::get('validation') }}</p>
                        </div>
                    </div>
                @endif
                <form action="{{ route('auth.index') }}" method="post" class="needs-validation" novalidate>
                    {{ csrf_field() }}
                    <div class="form-floating mb-3">
                        <input 
                            type="text" 
                            class="form-control" 
                            id="floatingInput" 
                            placeholder="name@example.com"
                            name="username"
                            value="{{ $username ?? '' }}"
                            required
                        />
                        <label for="floatingInput">Username</label>
                        <div class="invalid-feedback">
                            Please enter your username.
                        </div>
                    </div>
                    <div class="form-floating">
                        <input 
                            type="password" 
                            class="form-control" 
                            id="floatingPassword" 
                            placeholder="Password"
                            name="password"
                            value=""
                            required
                        />
                        <label for="floatingPassword">Password</label>
                        <div class="invalid-feedback">
                            Please enter your password.
                        </div>
                    </div>
                    <div class="form-check my-3">
                        <input 
                            class="form-check-input" 
                            type="checkbox" 
                            name="remember"
                            value="" 
                            id="checkDefault"
                        />
                        <label class="form-check-label fs-14" for="checkDefault">
                            Remember Me
                        </label>
                    </div>
                    <div class="col-12">
                        <button class="btn btn-primary w-100" type="submit">Sign In</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <!-- jQuery -->
    <script src="{{ asset('assets/js/app.js') }}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var loader = document.querySelector('.loader-wrapper');
            if (loader) {
                loader.style.transition = 'opacity 0.6s';
                loader.style.opacity = 0;
                setTimeout(function() {
                    loader.parentNode.removeChild(loader);
                }, 600);
            }
        });
        (function () {
            'use strict'
            var forms = document.querySelectorAll('.needs-validation')
            Array.prototype.slice.call(forms)
                .forEach(function (form) {
                    form.addEventListener('submit', function (event) {
                        if (!form.checkValidity()) {
                            event.preventDefault()
                            event.stopPropagation()
                        }
                        form.classList.add('was-validated')
                    }, false)
                })
        })()
    </script>
</body>

</html>
