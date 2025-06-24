<x-app-layout title="List Banner">
    <!-- Main content -->
    <section class="content">
        <div class="container-fluid">
            <livewire:banner />
        </div>
    </section>
    <!-- /.content-wrapper -->
    @slot('scripts')
        <script>
            window.addEventListener('close-modal', event => {
                $('#add-banner-modal').modal('hide');
                $('#edit-banner-modal').modal('hide');
                $('#delete-banner-modal').modal('hide')
            })
        </script>
    @endslot
</x-app-layout>
