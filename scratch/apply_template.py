import os

template_path = r"d:\Nayakarsa_New\Superadmin\scratch\perusahaan_new.blade.php"
dest_dir = r"d:\Nayakarsa_New\Superadmin\resources\views\superadmin"

with open(template_path, 'r', encoding='utf-8') as f:
    template_content = f.read()

def apply_template(type_id, type_title, placeholder_name, placeholder_email):
    content = template_content.replace('Perusahaan', type_title)
    content = template_content.replace('Perusahaan', type_title).replace('perusahaan', type_id)
    content = content.replace('PT Maju Bersama', placeholder_name)
    content = content.replace('admin@perusahaan.com', placeholder_email)
    
    # Fix the ID and route names that were lowercased unexpectedly
    # actually, .replace('perusahaan', type_id) will lowercase 'tbl-perusahaan' to 'tbl-sekolah' etc, which is fine
    
    dest_path = os.path.join(dest_dir, f"{type_id}.blade.php")
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Written {dest_path}")

apply_template('perusahaan', 'Perusahaan', 'PT Maju Bersama', 'admin@perusahaan.com')
apply_template('sekolah', 'Sekolah', 'SMAN 1 Jakarta', 'admin@sekolah.sch.id')
apply_template('universitas', 'Universitas', 'Universitas Indonesia', 'admin@kampus.ac.id')
