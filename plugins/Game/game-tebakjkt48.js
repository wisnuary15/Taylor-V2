import fetch from 'node-fetch';
let timeout = 120000
let poin = 4999
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  conn.tebakjkt48 = conn.tebakjkt48 ? conn.tebakjkt48 : {}
  let id = m.chat
  if (id in conn.tebakjkt48) {
    conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakjkt48[id][0])
    throw false
  }
  let members = [{
    name: "Alissa Galliamova",
    url: "https://rebornian48.com/images/member/gen01/mova.jpg"
  }, {
    name: "Allisa Astri",
    url: "https://rebornian48.com/images/member/gen01/allisa_astri.jpg"
  }, {
    name: "Ayana Shahab",
    url: "https://rebornian48.com/images/member/gen01/ayana_shahab.jpg"
  }, {
    name: "Beby Chaesara Anadila",
    url: "https://rebornian48.com/images/member/gen01/beby_chaseara_anadila.jpg"
  }, {
    name: "Cindy Gulla",
    url: "https://rebornian48.com/images/member/gen01/cigul.jpg"
  }, {
    name: "Cleopatra Djapri",
    url: "https://rebornian48.com/images/member/gen01/cleo.jpg"
  }, {
    name: "Delima Rizky",
    url: "https://rebornian48.com/images/member/gen01/delima.jpg"
  }, {
    name: "Devi Kinal Putri",
    url: "https://rebornian48.com/images/member/gen01/kinal.jpg"
  }, {
    name: "Diasta Priswarini",
    url: "https://rebornian48.com/images/member/gen01/diasta.jpg"
  }, {
    name: "Fahira",
    url: "https://rebornian48.com/images/member/gen01/fahira.jpg"
  }, {
    name: "Frieska Anastasia Laksani",
    url: "https://rebornian48.com/images/member/gen01/frieska_anastasia_laksani.jpg"
  }, {
    name: "Gabriela Margareth Warouw",
    url: "https://rebornian48.com/images/member/gen01/gabriella.jpg"
  }, {
    name: "Ghaida Farisya",
    url: "https://rebornian48.com/images/member/gen01/ghaida.jpg"
  }, {
    name: "Intania Pratama Ilham",
    url: "https://rebornian48.com/images/member/gen01/intania.jpg"
  }, {
    name: "Jessica Vania",
    url: "https://rebornian48.com/images/member/gen01/jeje.jpg"
  }, {
    name: "Jessica Veranda Tanumihardja",
    url: "https://rebornian48.com/images/member/gen01/ve.jpg"
  }, {
    name: "Melody Nurramdhani Laksani",
    url: "https://rebornian48.com/images/member/gen01/melody.jpg"
  }, {
    name: "Nabilah Ratna Ayu Azalia",
    url: "https://rebornian48.com/images/member/gen01/nabilah.jpg"
  }, {
    name: "Neneng Rosediana",
    url: "https://rebornian48.com/images/member/gen01/ochi.jpg"
  }, {
    name: "Rena Nozawa",
    url: "https://rebornian48.com/images/member/gen01/rena.jpg"
  }, {
    name: "Rezky Wiranti Dhike",
    url: "https://rebornian48.com/images/member/gen01/dhike.jpg"
  }, {
    name: "Rica Leyona",
    url: "https://rebornian48.com/images/member/gen01/rica.jpg"
  }, {
    name: "Sendy Ariani",
    url: "https://rebornian48.com/images/member/gen01/sendy.jpg"
  }, {
    name: "Shania Junianatha",
    url: "https://rebornian48.com/images/member/gen01/shanju.jpg"
  }, {
    name: "Siti Gayatri Abhirama",
    url: "https://rebornian48.com/images/member/gen01/siti_gayatri.jpg"
  }, {
    name: "Sonia Natalia",
    url: "https://rebornian48.com/images/member/gen01/sonia_natalia.jpg"
  }, {
    name: "Sonya Pandarmawan",
    url: "https://rebornian48.com/images/member/gen01/sonya.jpg"
  }, {
    name: "Stella Cornelia",
    url: "https://rebornian48.com/images/member/gen01/stella.jpg"
  }, {
    name: "Alicia Chanzia",
    url: "https://rebornian48.com/images/member/gen02/acak.jpg"
  }, {
    name: "Althea Callista",
    url: "https://rebornian48.com/images/member/gen02/althea.jpg"
  }, {
    name: "Annisa Athia",
    url: "https://rebornian48.com/images/member/gen02/Annisa_Athia.jpg"
  }, {
    name: "Cindy Yuvia",
    url: "https://rebornian48.com/images/member/gen02/cindy_yuvia.jpg"
  }, {
    name: "Della Delila",
    url: "https://rebornian48.com/images/member/gen02/della_delila.jpg"
  }, {
    name: "Dellia Erdita",
    url: "https://rebornian48.com/images/member/gen02/dellia.jpg"
  }, {
    name: "Dena Siti Rohyati",
    url: "https://rebornian48.com/images/member/gen02/dena.jpg"
  }, {
    name: "Dwi Putri Bonita",
    url: "https://rebornian48.com/images/member/gen02/uty.jpg"
  }, {
    name: "Fakhriyani Shafariyanti",
    url: "https://rebornian48.com/images/member/gen02/shafa.jpg"
  }, {
    name: "Intar Putri Kariina",
    url: "https://rebornian48.com/images/member/gen02/karin.jpg"
  }, {
    name: "Jennifer Hanna",
    url: "https://rebornian48.com/images/member/gen02/hanna.jpg"
  }, {
    name: "Jennifer Rachel Natasya",
    url: "https://rebornian48.com/images/member/gen02/jennifer_rachel_natasya.jpg"
  }, {
    name: "Lidya Maulida Djuhandar",
    url: "https://rebornian48.com/images/member/gen02/lidya.jpg"
  }, {
    name: "Nadhifa Karimah",
    url: "https://rebornian48.com/images/member/gen02/nadhifa.jpg"
  }, {
    name: "Nadila Cindi Wantari",
    url: "https://rebornian48.com/images/member/gen02/nadila_cindi_wantari.jpg"
  }, {
    name: "Natalia",
    url: "https://rebornian48.com/images/member/gen02/natalia.jpg"
  }, {
    name: "Noella Sisterina",
    url: "https://rebornian48.com/images/member/gen02/noella.jpg"
  }, {
    name: "Novinta Dhini",
    url: "https://rebornian48.com/images/member/gen02/nobi.jpg"
  }, {
    name: "Nurhalima Oktavianti",
    url: "https://rebornian48.com/images/member/gen02/halimah.jpg"
  }, {
    name: "Octi Sevpin",
    url: "https://rebornian48.com/images/member/gen02/octi.jpg"
  }, {
    name: "Olivia Robberecht",
    url: "https://rebornian48.com/images/member/gen02/olivia.jpg"
  }, {
    name: "Priscillia Sari Dewi",
    url: "https://rebornian48.com/images/member/gen02/sisil.jpg"
  }, {
    name: "Ratu Vienny Fitrilya",
    url: "https://rebornian48.com/images/member/gen02/ratu_vienny_fitrilya.jpg"
  }, {
    name: "Riskha Fairunissa",
    url: "https://rebornian48.com/images/member/gen02/riskha_fairunissa.jpg"
  }, {
    name: "Rona Anggreani",
    url: "https://rebornian48.com/images/member/gen02/rona_ariesta_anggraeni.jpg"
  }, {
    name: "Saktia Oktapyani",
    url: "https://rebornian48.com/images/member/gen02/saktia_oktapyani.jpg"
  }, {
    name: "Shinta Naomi",
    url: "https://rebornian48.com/images/member/gen02/shinta_naomi.jpg"
  }, {
    name: "Sinka Juliani",
    url: "https://rebornian48.com/images/member/gen02/sinka_juliani.jpg"
  }, {
    name: "Thalia",
    url: "https://rebornian48.com/images/member/gen02/thalia.jpg"
  }, {
    name: "Thalia Ivanka Elizabeth",
    url: "https://rebornian48.com/images/member/gen02/thalia_ivanka_elizabeth.jpg"
  }, {
    name: "Viviyona Apriani",
    url: "https://rebornian48.com/images/member/gen02/viviyona_apriani.jpg"
  }, {
    name: "Alycia Ferryana",
    url: "https://rebornian48.com/images/member/gen03/cia.jpg"
  }, {
    name: "Amanda Dwi Arista",
    url: "https://rebornian48.com/images/member/gen03/manda.jpg"
  }, {
    name: "Andela Yuwono",
    url: "https://rebornian48.com/images/member/gen03/andela.jpg"
  }, {
    name: "Anggie Putri Kurniasari",
    url: "https://rebornian48.com/images/member/gen03/anggie.jpg"
  }, {
    name: "Aninditha Rahma Cahyadi",
    url: "https://rebornian48.com/images/member/gen03/aninditha_rahma_cahyadi.jpg"
  }, {
    name: "Ayu Safira Oktaviani",
    url: "https://rebornian48.com/images/member/gen03/ayu_safira_oktaviani.jpg"
  }, {
    name: "Chikita Ravenska Mamesah",
    url: "https://rebornian48.com/images/member/gen03/chikita.jpg"
  }, {
    name: "Elaine Hartanto",
    url: "https://rebornian48.com/images/member/gen03/elaine.jpg"
  }, {
    name: "Farina Yogi Devani",
    url: "https://rebornian48.com/images/member/gen03/farina.jpg"
  }, {
    name: "Feni Fitriyanti",
    url: "https://rebornian48.com/images/member/gen03/feni_fitriyanti.jpg"
  }, {
    name: "Fransisca Saraswati Puspa Dewi",
    url: "https://rebornian48.com/images/member/gen03/fransisca_saraswati_puspa_dewi.jpg"
  }, {
    name: "Indah Permata Sari",
    url: "https://rebornian48.com/images/member/gen03/indah_permata.jpg"
  }, {
    name: "Kezia Putri Andinta",
    url: "https://rebornian48.com/images/member/gen03/kei.jpg"
  }, {
    name: "Maria Genoveva Natalia Desy Purnamasari Gunawan",
    url: "https://rebornian48.com/images/member/gen03/maria_genoveva_natalia_desy_purnamasari_gunawan.jpg"
  }, {
    name: "Martha Graciela",
    url: "https://rebornian48.com/images/member/gen03/martha_graciela.jpg"
  }, {
    name: "Michelle Christo Kusnadi",
    url: "https://rebornian48.com/images/member/gen03/michelle_christo_kusnadi.jpg"
  }, {
    name: "Milenia Christien Glory Goenawan",
    url: "https://rebornian48.com/images/member/gen03/milen.jpg"
  }, {
    name: "Nadhifa Salsabila",
    url: "https://rebornian48.com/images/member/gen03/nadse.jpg"
  }, {
    name: "Ni Made Ayu Vania Aurellia",
    url: "https://rebornian48.com/images/member/gen03/made_ayu_vania_aurellia.jpg"
  }, {
    name: "Nina Hamidah",
    url: "https://rebornian48.com/images/member/gen03/nina_hamidah.jpg"
  }, {
    name: "Pipit Ananda",
    url: "https://rebornian48.com/images/member/gen03/pipit.jpg"
  }, {
    name: "Putri Farin Kartika",
    url: "https://rebornian48.com/images/member/gen03/farin.jpg"
  }, {
    name: "Rizka Khalila",
    url: "https://rebornian48.com/images/member/gen03/yukka.jpg"
  }, {
    name: "Shaffa Nabila",
    url: "https://rebornian48.com/images/member/gen03/shaffa_nabila.jpg"
  }, {
    name: "Shani Indira Natio",
    url: "https://rebornian48.com/images/member/gen03/shani_indira_natio.jpg"
  }, {
    name: "Shania Gracia",
    url: "https://rebornian48.com/images/member/gen03/shania_gracia.jpg"
  }, {
    name: "Sofia Meifaliani",
    url: "https://rebornian48.com/images/member/gen03/sofia.jpg"
  }, {
    name: "Stephanie Pricilla Indarto Putri",
    url: "https://rebornian48.com/images/member/gen03/stephanie_pricilla_indarto_putri.jpg"
  }, {
    name: "Syahfira Angela Nurhaliza",
    url: "https://rebornian48.com/images/member/gen03/syahfira_angela_nurhaliza.jpg"
  }, {
    name: "Triarona Kusuma",
    url: "https://rebornian48.com/images/member/gen03/tya.jpg"
  }, {
    name: "Yansen Indiani",
    url: "https://rebornian48.com/images/member/gen03/cesen.jpg"
  }, {
    name: "Zebi Magnolia Fawwaz",
    url: "https://rebornian48.com/images/member/gen03/zebi.jpg"
  }, {
    name: "Adriani Elizabeth",
    url: "https://rebornian48.com/images/member/gen04/adriani_elizabeth.jpg"
  }, {
    name: "Christi",
    url: "https://rebornian48.com/images/member/gen04/christi.jpg"
  }, {
    name: "Cindy Hapsari Maharani Pujiantoro Putri",
    url: "https://rebornian48.com/images/member/gen04/cindy_hapsari.jpg"
  }, {
    name: "Fidly Immanda Azzahra",
    url: "https://rebornian48.com/images/member/gen04/fidly_immanda_azzahra.jpg"
  }, {
    name: "Jessica Berliana Ekawardani",
    url: "https://rebornian48.com/images/member/gen04/jessicaberliana.jpg"
  }, {
    name: "Jinan Safa Safira",
    url: "https://rebornian48.com/images/member/gen04/jinan_safa_safira.jpg"
  }, {
    name: "Made Devi Ranita Ningtara",
    url: "https://rebornian48.com/images/member/gen04/made_devi_ranita.jpg"
  }, {
    name: "Mega Suryani",
    url: "https://rebornian48.com/images/member/gen04/mega_suryani.jpg"
  }, {
    name: "Melati Putri Rahel Sesilia",
    url: "https://rebornian48.com/images/member/gen04/melati_putri_rahel.jpg"
  }, {
    name: "Sri Lintang",
    url: "https://rebornian48.com/images/member/gen04/sri_lintang.jpg"
  }, {
    name: "Tan Zhi Hui Celine",
    url: "https://rebornian48.com/images/member/gen04/tan_zhi_hui_celine.jpg"
  }, {
    name: "Zahra Yuriva Dermawan",
    url: "https://rebornian48.com/images/member/gen04/yuriva.jpg"
  }, {
    name: "Adhisty Zara",
    url: "https://rebornian48.com/images/member/gen05/adhisty_zara.jpg"
  }, {
    name: "Anggita Destiana Dewi",
    url: "https://rebornian48.com/images/member/gen05/anggita_destiana.jpg"
  }, {
    name: "Chintya Hanindhitakirana Wirawan",
    url: "https://rebornian48.com/images/member/gen05/chintya.jpg"
  }, {
    name: "Citra Ayu Pranajaya Wibrado",
    url: "https://rebornian48.com/images/member/gen05/citra.jpg"
  }, {
    name: "Diani Amalia Ramadhani",
    url: "https://rebornian48.com/images/member/gen05/diani.jpg"
  }, {
    name: "Elizabeth Gloria Setiawan",
    url: "https://rebornian48.com/images/member/gen05/glori.jpg"
  }, {
    name: "Eve Antoinette Ichwan",
    url: "https://rebornian48.com/images/member/gen05/eve_antoinette.jpg"
  }, {
    name: "Gabryela Marcelina",
    url: "https://rebornian48.com/images/member/gen05/gabryela_marcelina.jpg"
  }, {
    name: "Hasyakyla Utami Kusumawardhani",
    url: "https://rebornian48.com/images/member/gen05/haskyla_utami.jpg"
  }, {
    name: "Helma Sonya",
    url: "https://rebornian48.com/images/member/gen05/helma_sonya.jpg"
  }, {
    name: "Nurhayati",
    url: "https://rebornian48.com/images/member/gen05/nurhayati.jpg"
  }, {
    name: "Puti Nadhira Azalia",
    url: "https://rebornian48.com/images/member/gen05/puti_nadhira.jpg"
  }, {
    name: "Regina Angelina",
    url: "https://rebornian48.com/images/member/gen05/regina.jpg"
  }, {
    name: "Rissanda Putri Tuarissa",
    url: "https://rebornian48.com/images/member/gen05/rissanda_putri.jpg"
  }, {
    name: "Ruth Damayanti Sitanggang",
    url: "https://rebornian48.com/images/member/gen05/ruth.jpg"
  }, {
    name: "Sania Julia Montolalu",
    url: "https://rebornian48.com/images/member/gen05/sania_julia.jpg"
  }, {
    name: "Violeta Burhan",
    url: "https://rebornian48.com/images/member/gen05/violeta_burhan.jpg"
  }, {
    name: "Amanda Priscella Solichin",
    url: "https://rebornian48.com/images/member/gen06/amandapricella.jpg"
  }, {
    name: "Anastasya Narwastu Tety Handuran",
    url: "https://rebornian48.com/images/member/gen06/anastasya_narwastu_tety_handuran.jpg"
  }, {
    name: "Ariella Calista Ichwan",
    url: "https://rebornian48.com/images/member/gen06/ariel.jpg"
  }, {
    name: "Denise Caroline",
    url: "https://rebornian48.com/images/member/gen06/denise.jpg"
  }, {
    name: "Erika Ebisawa Kuswan",
    url: "https://rebornian48.com/images/member/gen06/erika.jpg"
  }, {
    name: "Erika Sintia",
    url: "https://rebornian48.com/images/member/gen06/erikasintia.jpg"
  }, {
    name: "Gita Sekar Andarini",
    url: "https://rebornian48.com/images/member/gen06/gita_sekar_andarini.jpg"
  }, {
    name: "Graciella Ruth Wiranto",
    url: "https://rebornian48.com/images/member/gen06/wiranto.jpg"
  }, {
    name: "Jihan Miftahul Jannah",
    url: "https://rebornian48.com/images/member/gen06/jihanmiftahul.jpg"
  }, {
    name: "Kandiya Rafa Maulidita",
    url: "https://rebornian48.com/images/member/gen06/kandiya_rafa_maulidita.jpg"
  }, {
    name: "Putri Cahyaning Anggraini",
    url: "https://rebornian48.com/images/member/gen06/riri.jpg"
  }, {
    name: "Rinanda Syahputri",
    url: "https://rebornian48.com/images/member/gen06/rinanda.jpg"
  }, {
    name: "Riska Amelia Putri",
    url: "https://rebornian48.com/images/member/gen06/riska_amelia_putri.jpg"
  }, {
    name: "Shalza Grasita",
    url: "https://rebornian48.com/images/member/gen06/shalza.jpg"
  }, {
    name: "Aiko Harumi Nangin",
    url: "https://rebornian48.com/images/member/gen07/Aiko_Harumi.jpg"
  }, {
    name: "Angelina Christy",
    url: "https://rebornian48.com/images/member/gen07/angelina_christy.jpg"
  }, {
    name: "Aurel Mayori",
    url: "https://rebornian48.com/images/member/gen07/aurel_mayori.jpg"
  }, {
    name: "Azizi Asadel",
    url: "https://rebornian48.com/images/member/gen07/azizi_asadel.jpg"
  }, {
    name: "Calista Lea Jaya",
    url: "https://rebornian48.com/images/member/gen07/callista.jpg"
  }, {
    name: "Dhea Angelia",
    url: "https://rebornian48.com/images/member/gen07/dhea_angelia.jpg"
  }, {
    name: "Febi Komaril",
    url: "https://rebornian48.com/images/member/gen07/Febi.jpg"
  }, {
    name: "Febrina Diponegoro",
    url: "https://rebornian48.com/images/member/gen07/febrina.jpg"
  }, {
    name: "Febriola Sinambela",
    url: "https://rebornian48.com/images/member/gen07/febriola_sinambela.jpg"
  }, {
    name: "Freya Jayawardana",
    url: "https://rebornian48.com/images/member/gen07/freya_jayawardana.jpg"
  }, {
    name: "Gabriel Angelina",
    url: "https://rebornian48.com/images/member/gen07/gabriel_angelina.jpg"
  }, {
    name: "Helisma Putri",
    url: "https://rebornian48.com/images/member/gen07/helisma_putri.jpg"
  }, {
    name: "Jessica Chandra",
    url: "https://rebornian48.com/images/member/gen07/jessica_chandra.jpg"
  }, {
    name: "Jesslyn Callista",
    url: "https://rebornian48.com/images/member/gen07/jesslyn_callista.jpg"
  }, {
    name: "Kanya Caya",
    url: "https://rebornian48.com/images/member/gen07/kanya_caya.jpg"
  }, {
    name: "Mutiara Azzahra",
    url: "https://rebornian48.com/images/member/gen07/mutiara_azzahra.jpg"
  }, {
    name: "Nabila Fitriana",
    url: "https://rebornian48.com/images/member/gen07/nabila_fitriana.jpg"
  }, {
    name: "Rifa Fatmasari",
    url: "https://rebornian48.com/images/member/gen07/rifa.jpg"
  }, {
    name: "Viona Fadrin",
    url: "https://rebornian48.com/images/member/gen07/viona_fadrin.jpg"
  }, {
    name: "Yessica Tamara",
    url: "https://rebornian48.com/images/member/gen07/yessica_tamara.jpg"
  }, {
    name: "Amanina Afiqah",
    url: "https://rebornian48.com/images/member/gen08/amanina_afiqah.jpg"
  }, {
    name: "Amirah Fatin",
    url: "https://rebornian48.com/images/member/gen08/amirah_fatin.jpg"
  }, {
    name: "Cindy Nugroho",
    url: "https://rebornian48.com/images/member/gen08/cindy_nugroho.jpg"
  }, {
    name: "Cornelia Vanisa",
    url: "https://rebornian48.com/images/member/gen08/cornelia_vanisa.jpg"
  }, {
    name: "Devytha Maharani Putri",
    url: "https://rebornian48.com/images/member/gen08/devytha_maharani.jpg"
  }, {
    name: "Eriena Kartika Dewi",
    url: "https://rebornian48.com/images/member/gen08/eriena.jpg"
  }, {
    name: "Fiony Alveria",
    url: "https://rebornian48.com/images/member/gen08/fiony_alveria.jpg"
  }, {
    name: "Flora Shafiq",
    url: "https://rebornian48.com/images/member/gen08/flora_shafiq.jpg"
  }, {
    name: "Gabriella Stevany",
    url: "https://rebornian48.com/images/member/gen08/gabriella_vany.jpg"
  }, {
    name: "Keisya Ramadhani",
    url: "https://rebornian48.com/images/member/gen08/keisya.jpg"
  }, {
    name: "Lulu Salsabila",
    url: "https://rebornian48.com/images/member/gen08/lulu_salsabila.jpg"
  }, {
    name: "Nyimas Ratu Rafa",
    url: "https://rebornian48.com/images/member/gen08/nyimas_ratu_rafa.jpg"
  }, {
    name: "Pamela Krysanthe Adijaya",
    url: "https://rebornian48.com/images/member/gen08/pamela.jpg"
  }, {
    name: "Reva Adriana Ramadhani",
    url: "https://rebornian48.com/images/member/gen08/reva_p.jpg"
  }, {
    name: "Reva Fidela",
    url: "https://rebornian48.com/images/member/gen08/reva_fidela.jpg"
  }, {
    name: "Salma Annisa",
    url: "https://rebornian48.com/images/member/gen08/salma.jpg"
  }, {
    name: "Umega Maulana",
    url: "https://rebornian48.com/images/member/gen08/umega_maulana.jpg"
  }, {
    name: "Zahra Nur",
    url: "https://rebornian48.com/images/member/gen08/zahra_nur.jpg"
  }, {
    name: "Adzana Shaliha",
    url: "https://rebornian48.com/images/member/gen09/Adzana_Shaliha.jpg"
  }, {
    name: "Caithlyn Gwyneth",
    url: "https://rebornian48.com/images/member/gen09/Chaitlyn_Gwyneth.jpg"
  }, {
    name: "Chalista Ellysia",
    url: "https://rebornian48.com/images/member/gen09/Chalista_Ellysia.jpg"
  }, {
    name: "Christabel Jocelyn",
    url: "https://rebornian48.com/images/member/gen09/Christabel_Jocelyn.jpg"
  }, {
    name: "Indah Cahya",
    url: "https://rebornian48.com/images/member/gen09/indah_cahya.jpg"
  }, {
    name: "Iris Vevina Prasetio",
    url: "https://rebornian48.com/images/member/gen09/iris.jpg"
  }, {
    name: "Kathrina Irene",
    url: "https://rebornian48.com/images/member/gen09/kathrina_irene.jpg"
  }, {
    name: "Marsha Lenathea",
    url: "https://rebornian48.com/images/member/gen09/marsha_lenathea.jpg"
  }, {
    name: "Nabila Gusmarlia",
    url: "https://rebornian48.com/images/member/gen09/nabila_gusmarila.jpg"
  }, {
    name: "Olivia Payten",
    url: "https://rebornian48.com/images/member/gen09/olivia_payten.jpg"
  }, {
    name: "Putri Elzahra",
    url: "https://rebornian48.com/images/member/gen09/putri_elzahra.jpg"
  }, {
    name: "Shinta Devi",
    url: "https://rebornian48.com/images/member/gen09/shinta_devi.jpg"
  }, {
    name: "Tiara Sasi Kirana Putri",
    url: "https://rebornian48.com/images/member/gen09/tiara_sasi.jpg"
  }, {
    name: "Abieza Syabira",
    url: "https://rebornian48.com/images/member/gen10/abieza.jpg"
  }, {
    name: "Alia Giselle Maharani",
    url: "https://rebornian48.com/images/member/gen10/alia.jpg"
  }, {
    name: "Amanda Puspita Sukma Mulyadewi",
    url: "https://rebornian48.com/images/member/gen10/amanda.jpg"
  }, {
    name: "Aurellia",
    url: "https://rebornian48.com/images/member/gen10/lia.jpg"
  }, {
    name: "Amanda Puspita Sukma Mulyadewi",
    url: "https://rebornian48.com/images/member/gen10/amanda.jpg"
  }, {
    name: "Callista Alifia Wardhana",
    url: "https://rebornian48.com/images/member/gen10/callie.jpg"
  }, {
    name: "Danessa Valerie Hertanto",
    url: "https://rebornian48.com/images/member/gen10/danessa.jpg"
  }, {
    name: "Gabriela Abigail Mewengkang",
    url: "https://rebornian48.com/images/member/gen10/ella.jpg"
  }, {
    name: "Indira Putri Seruni",
    url: "https://rebornian48.com/images/member/gen10/indira.jpg"
  }, {
    name: "Jesslyn Elly",
    url: "https://rebornian48.com/images/member/gen10/lyn.jpg"
  }, {
    name: "Naura Safinatunnajah",
    url: "https://rebornian48.com/images/member/gen10/naura.jpg"
  }, {
    name: "Raisha Syifa Wardhana",
    url: "https://rebornian48.com/images/member/gen10/raisha.jpg"
  }, {
    name: "Alya Amanda",
    url: "https://rebornian48.com/images/member/gen11/Alya.jpg"
  }, {
    name: "Anindya Ramadhani",
    url: "https://rebornian48.com/images/member/gen11/Anindya.jpg"
  }, {
    name: "Aulia Asyira Basarestu",
    url: "https://rebornian48.com/images/member/gen11/Aulia.jpg"
  }, {
    name: "Cathleen Nixie",
    url: "https://rebornian48.com/images/member/gen11/Cathy.jpg"
  }, {
    name: "Celline Thefannie",
    url: "https://rebornian48.com/images/member/gen11/Elin.jpg"
  }, {
    name: "Chelsea Davina Norman",
    url: "https://rebornian48.com/images/member/gen11/Chelsea.jpg"
  }, {
    name: "Cynthia Yaputera",
    url: "https://rebornian48.com/images/member/gen11/Cynthia.jpg"
  }, {
    name: "Dena Natalia",
    url: "https://rebornian48.com/images/member/gen11/Danella.jpg"
  }, {
    name: "Desy Natalia",
    url: "https://rebornian48.com/images/member/gen11/Daisy.jpg"
  }, {
    name: "Gendis Mayrannisa",
    url: "https://rebornian48.com/images/member/gen11/Gendis.jpg"
  }, {
    name: "Grace Octaviani",
    url: "https://rebornian48.com/images/member/gen11/Gracie.jpg"
  }, {
    name: "Greesella Sophina Adhalia",
    url: "https://rebornian48.com/images/member/gen11/Greesel.jpg"
  }, {
    name: "Jeane Victoria",
    url: "https://rebornian48.com/images/member/gen11/Jeane.jpg"
  }, {
    name: "Michelle Alexandra",
    url: "https://rebornian48.com/images/member/gen11/Michie.jpg"
  }, {
    name: "Aki Takajo",
    url: "https://rebornian48.com/images/member/kaigai/akicha.jpg"
  }, {
    name: "Haruka Nakagawa",
    url: "https://rebornian48.com/images/member/kaigai/haruka.jpg"
  }, {
    name: "Rina Chikano",
    url: "https://rebornian48.com/images/member/kaigai/chikarina.jpg"
  }, {
    name: "Saya Kawamoto",
    url: "https://rebornian48.com/images/member/kaigai/sayaya.jpg"
  }];
  let src = members;
  let json = src[Math.floor(Math.random() * src.length)]
  let caption = `*${command.toUpperCase()}*
siapakah nama member ini?
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hjkt untuk bantuan
Bonus: ${poin} XP
    `.trim()
  conn.tebakjkt48[id] = [
    conn.sendFile(m.chat, json.url, '', caption, m),
    json, poin,
    setTimeout(() => {
      if (conn.tebakjkt48[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.name}*`, conn
        .tebakjkt48[id][0])
      delete conn.tebakjkt48[id]
    }, timeout)
  ]
}
handler.help = ['tebakjkt48']
handler.tags = ['game']
handler.command = /^tebakjkt48/i
export default handler
const buttons = [
  ['Hint', '/hjkt'],
  ['Nyerah', 'menyerah']
]
