export const isActive = (path) => location.pathname.startsWith(path);
export const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
export const isMenuGroupActive = (system) => {
    return system.access_list.some(menu =>
        isActive(`/${slugify(system.system_name)}/${slugify(menu.menu_name)}`)
    );
};