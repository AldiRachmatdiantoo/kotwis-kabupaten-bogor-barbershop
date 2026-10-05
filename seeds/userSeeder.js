/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export const seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
      {
      name: 'Budi Santoso',
      password: '12345',
      phone: 812345678,
      address: 'Jl. Merdeka No. 10, Jakarta',
      role: 'admin'
    },
    {
      name: 'Siti Aminah',
      password: 'password_hashed_2',
      phone: 813987654,
      address: 'Jl. Mawar No. 5, Bandung',
      role: 'manager'
    },
    {
      name: 'Rian Hidayat',
      password: 'password_hashed_3',
      phone: 857112233,
      address: 'Jl. Melati No. 12, Surabaya',
      role: 'customer'
    },
    {
      name: 'Dewi Lestari',
      password: 'password_hashed_4',
      phone: 819445566,
      address: 'Jl. Anggrek No. 8, Yogyakarta',
      role: 'customer'
    },
    {
      name: 'Eko Prasetyo',
      password: 'password_hashed_5',
      phone: 821889900,
      address: 'Jl. Dahlia No. 3, Semarang',
      role: 'customer'
    },
    {
      name: 'Fani Fitriani',
      password: 'password_hashed_6',
      phone: 878334455,
      address: 'Jl. Kenanga No. 15, Medan',
      role: 'manager'
    },
    {
      name: 'Gilang Permana',
      password: 'password_hashed_7',
      phone: 812556677,
      address: 'Jl. Cempaka No. 20, Makassar',
      role: 'customer'
    },
    {
      name: 'Hani Wijaya',
      password: 'password_hashed_8',
      phone: 813778899,
      address: 'Jl. Kamboja No. 7, Denpasar',
      role: 'customer'
    },
    {
      name: 'Indra Kusuma',
      password: 'password_hashed_9',
      phone: 856990011,
      address: 'Jl. Teratai No. 11, Palembang',
      role: 'admin'
    },
    {
      name: 'Joko Widodo',
      password: 'password_hashed_10',
      phone: 819223344,
      address: 'Jl. Flamboyan No. 4, Balikpapan',
      role: 'customer'
    }
  ]);
};
