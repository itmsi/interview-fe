<x-app-layout title="List User">
    <!-- Main content -->
    <section class="content">
        <div class="container-fluid">
            <livewire:user />
        </div>
    </section>
    <!-- /.content-wrapper -->
    @slot('scripts')
        <script>
            window.addEventListener('close-modal', event => {
                $('#add-user-modal').modal('hide');
                $('#edit-user-modal').modal('hide');
                $('#delete-user-modal').modal('hide')
            })
        </script>
    @endslot
</x-app-layout>
