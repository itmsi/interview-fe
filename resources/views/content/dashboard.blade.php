<x-app-layout title="Dashboard">
    <!-- Main content -->
    <section class="content">
        <div class="container-fluid">
            <livewire:dashboard />
        </div>
    </section>
    <!-- /.content-wrapper -->
    @slot('scripts')
        <script>
            window.addEventListener('close-modal', event => {
            })
        </script>
    @endslot
</x-app-layout>
