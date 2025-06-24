{!! $list !!}

@push('scripts')
    <script>
        document.addEventListener('livewire:init', function () {
            Livewire.on('assignPermission', (permissionId, menuId, value) => {
                // Handle the event if needed
            });
        });

        $(document).ready(function() {
            $(".checkbox").change(function() {
                if (this.checked) {
                    Livewire.dispatch('assignPermission', {
                        permission_id: this.value,
                        menu_id: $(this).data("menuid"),
                        value: true
                    });
                } else {
                    Livewire.dispatch('assignPermission', {
                        permission_id: this.value,
                        menu_id: $(this).data("menuid"),
                        value: false
                    });
                }
            });
        });
    </script>
@endpush

@livewireScripts
