/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export const seed = async function(knex) {
  await knex('services').del();  
  await knex('services').insert([
    {
      name: 'Pembersihan AC',
      category: 'Elektronik',
      status: true,
      description: 'Layanan cuci AC rumah dan kantor skala kecil hingga besar.'
    },
    {
      name: 'Service Kulkas',
      category: 'Elektronik',
      status: false,
      description: 'Perbaikan kulkas tidak dingin atau mati total.'
    },
    {
      name: 'Instalasi Listrik',
      category: 'Kelistrikan',
      status: true,
      description: 'Pemasangan jalur kabel baru dan perbaikan korsleting.'
    }
  ]);
};
