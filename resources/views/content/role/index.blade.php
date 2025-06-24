<x-app-layout title="List Role">
    <!-- Main content -->
    <section class="content">
        <div class="container-fluid">
            <livewire:role />
        </div>
    </section>
    <!-- /.content-wrapper -->
    @slot('scripts')
        <script>
            window.addEventListener('close-modal', event => {
                $('#add-role-modal').modal('hide');
                $('#edit-role-modal').modal('hide');
                $('#delete-role-modal').modal('hide')
            })
        </script>
    @endslot
</x-app-layout>
