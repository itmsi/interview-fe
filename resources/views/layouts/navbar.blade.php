<!-- Navbar -->
<nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
        </li>
        @foreach ($navbar as $item => $url)
            <li class="nav-item"><a class="nav-link" href="{{ $url }}">{{ $item }}</a></li>
        @endforeach
    </ul>
    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
        <li class="nav-item">
            <a class="nav-link" data-widget="fullscreen" href="#" role="button">
                <i class="fas fa-expand-arrows-alt"></i>
            </a>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link"  data-toggle="dropdown" href="javascript:void(0)" role="button">
                <i class="fas fa-ellipsis-v"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <a href="{{ route('auth.change-password') }}" class="dropdown-item">
                  <i class="fas fa-key mr-2"></i> Ganti Password
                </a>
                <a class="dropdown-item" href="{{ route('auth.logout') }}">
                <div class="dropdown-divider"></div>
                <i class="fas fa-sign-out-alt mr-2"></i>
                Logout</a>
              </div>

        </li>
    </ul>
</nav>
