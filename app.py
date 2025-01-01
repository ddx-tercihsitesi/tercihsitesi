from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3

app = Flask(__name__)
app.secret_key = "gizli_anahtar"  # Güvenlik için gizli bir anahtar ekleyin.
DATABASE = "tercihler.db"

# Veritabanı bağlantısı
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Veritabanı oluşturma ve tabloları tanımlama
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS kullanicilar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ad_soyad TEXT NOT NULL,
            sifre TEXT NOT NULL,
            hizmet_puani INTEGER NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tercihler (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kullanici_id INTEGER NOT NULL,
            tercih_sirasi INTEGER NOT NULL,
            kadro TEXT NOT NULL,
            FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id)
        )
    """)
    conn.commit()
    conn.close()

init_db()

# Münhal kadrolar listesi
kadrolar = [
    "ANKARA BEYPAZARI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "ANKARA NALLIHAN TOPLUM SAĞLIĞI MERKEZİ",
    "ANKARA ŞEREFLİKOÇHİSAR İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "ANTALYA ELMALI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "ANTALYA KAŞ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "ANTALYA MANAVGAT İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "AYDIN DİDİM İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "AYDIN KÖŞK TOPLUM SAĞLIĞI MERKEZİ",
    "AYDIN KUŞADASI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "BALIKESİR ALTIEYLÜL İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "BALIKESİR BANDIRMA İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "BALIKESİR BİGADİÇ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "BALIKESİR BURHANİYE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "BALIKESİR DURSUNBEY İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "BALIKESİR EDREMİT İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "BİLECİK MERKEZ TOPLUM SAĞLIĞI MERKEZİ",
    "BURDUR ÇELTİKÇİ ŞEHİT ALİ TEKİN TOPLUM SAĞLIĞI MERKEZİ",
    "BURDUR KEMER TOPLUM SAĞLIĞI MERKEZİ",
    "BURSA GEMLİK İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "BURSA İNEGÖL İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "BURSA ORHANELİ TOPLUM SAĞLIĞI MERKEZİ",
    "BURSA ORHANGAZİ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "BURSA OSMANGAZİ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "DENİZLİ ACIPAYAM İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "DENİZLİ BEKİLLİ TOPLUM SAĞLIĞI MERKEZİ",
    "DENİZLİ ÇAL TOPLUM SAĞLIĞI MERKEZİ",
    "DENİZLİ KALE TOPLUM SAĞLIĞI MERKEZİ",
    "DENİZLİ PAMUKKALE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "DÜZCE CUMAYERİ TOPLUM SAĞLIĞI MERKEZİ",
    "DÜZCE GÖLYAKA TOPLUM SAĞLIĞI MERKEZİ",
    "DÜZCE KAYNAŞLI TOPLUM SAĞLIĞI MERKEZİ",
    "ELAZIĞ SİVRİCE TOPLUM SAĞLIĞI MERKEZİ",
    "ERZİNCAN İLİÇ İLÇE DEVLET HASTANESİ",
    "ERZİNCAN REFAHİYE DR. FAHRETTİN UĞUR İLÇE DEVLET HASTANESİ",
    "ESKİŞEHİR SARICAKAYA TOPLUM SAĞLIĞI MERKEZİ",
    "ESKİŞEHİR SEYİTGAZİ TOPLUM SAĞLIĞI MERKEZİ",
    "ESKİŞEHİR TEPEBAŞI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "GAZİANTEP NİZİP İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "GAZİANTEP ŞAHİNBEY İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "GİRESUN DOĞANKENT TOPLUM SAĞLIĞI MERKEZİ",
    "GİRESUN ESPİYE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "GİRESUN TİREBOLU İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "HATAY ALTINÖZÜ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "HATAY ARSUZ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "HATAY DEFNE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "HATAY DÖRTYOL İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "HATAY İSKENDERUN İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "HATAY YAYLADAĞI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL AVCILAR İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL BAYRAMPAŞA İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL BEYLİKDÜZÜ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL BÜYÜKÇEKMECE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL ÇEKMEKÖY İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL EYÜPSULTAN İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL FATİH İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL GÜNGÖREN İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL KADIKÖY İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL KAĞITHANE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL SANCAKTEPE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL SULTANBEYLİ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL TUZLA İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL ÜMRANİYE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İSTANBUL ÜSKÜDAR İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "İZMİR DİKİLİ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "KAYSERİ SARIOĞLAN TOPLUM SAĞLIĞI MERKEZİ",
    "KAYSERİ YAHYALI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "MANİSA ALAŞEHİR İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "MANİSA GÖLMARMARA TOPLUM SAĞLIĞI MERKEZİ",
    "MANİSA TURGUTLU İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "MERSİN ANAMUR İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "MERSİN SİLİFKE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "MERSİN TARSUS İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "MERSİN TOROSLAR İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "ORDU ÇAMAŞ TOPLUM SAĞLIĞI MERKEZİ",
    "ORDU ÇATALPINAR JANDARMA ER ŞÜKRÜ GELİR TOPLUM SAĞLIĞI MERKEZİ",
    "ORDU GÜLYALI TOPLUM SAĞLIĞI MERKEZİ",
    "SAKARYA GEYVE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "SAKARYA HENDEK İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "SAKARYA KARAPÜRÇEK TOPLUM SAĞLIĞI MERKEZİ",
    "SAKARYA KARASU İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "SAKARYA KOCAALİ TOPLUM SAĞLIĞI MERKEZİ",
    "SAKARYA SÖĞÜTLÜ TOPLUM SAĞLIĞI MERKEZİ",
    "SAMSUN ASARCIK TOPLUM SAĞLIĞI MERKEZİ",
    "SAMSUN SALIPAZARI TOPLUM SAĞLIĞI MERKEZİ",
    "SAMSUN TEKKEKÖY İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "TEKİRDAĞ ÇERKEZKÖY İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "TEKİRDAĞ ÇORLU İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "TEKİRDAĞ KAPAKLI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "TRABZON DERNEKPAZARI TOPLUM SAĞLIĞI MERKEZİ",
    "TRABZON HAYRAT TOPLUM SAĞLIĞI MERKEZİ",
    "ZONGULDAK ÇAYCUMA İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "ZONGULDAK DEVREK İLÇE SAĞLIK MÜDÜRLÜĞÜ",
    "ZONGULDAK EREĞLİ İLÇE SAĞLIK MÜDÜRLÜĞÜ"
]
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        form_type = request.form.get("form_type")

        if form_type == "kaydol":
           ad_soyad = request.form.get("ad_soyad")
           sifre = request.form.get("sifre")
           hizmet_puani = request.form.get("hizmet_puani")

           conn = get_db_connection()
           cursor = conn.cursor()
           cursor.execute("INSERT INTO kullanicilar (ad_soyad, sifre, hizmet_puani) VALUES (?, ?, ?)",
                        (ad_soyad, sifre, hizmet_puani))
           conn.commit()
           conn.close()
           return redirect(url_for('index'))


        if form_type == "giris":
          sifre = request.form.get("giris_sifre")

          conn = get_db_connection()
          cursor = conn.cursor()
          cursor.execute("SELECT * FROM kullanicilar WHERE sifre = ?", (sifre,))
          kullanici = cursor.fetchone()
          conn.close()
          if kullanici:
            session["kullanici_id"] = kullanici["id"]
            session["ad_soyad"] = kullanici["ad_soyad"]
            session["hizmet_puani"] = kullanici["hizmet_puani"]
          else:
            return render_template("index.html", kadrolar=kadrolar, mesaj="Geçersiz giriş")
          return redirect(url_for('index'))

        if form_type == "guncelle":
           yeni_hizmet_puani= request.form.get("guncel_hizmet_puani")
           if 'kullanici_id' in session:
             kullanici_id = session["kullanici_id"]
             conn = get_db_connection()
             cursor = conn.cursor()
             cursor.execute("UPDATE kullanicilar SET hizmet_puani = ? WHERE id = ?", (yeni_hizmet_puani, kullanici_id))
             conn.commit()
             conn.close()
             session["hizmet_puani"] = yeni_hizmet_puani
           else:
               return render_template("index.html", kadrolar=kadrolar, mesaj="Giriş yapmadan puan güncellenemez")
           return redirect(url_for('index'))

        if form_type == "kayit_sil":
          sifre=request.form.get("sil_sifre")
          if 'kullanici_id' in session:
            kullanici_id=session["kullanici_id"]
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT sifre FROM kullanicilar WHERE id = ?", (kullanici_id,))
            kullanici=cursor.fetchone()
            if kullanici["sifre"] == sifre:
              cursor.execute("DELETE FROM kullanicilar WHERE id = ?", (kullanici_id,))
              cursor.execute("DELETE FROM tercihler WHERE kullanici_id = ?", (kullanici_id,))
              conn.commit()
              conn.close()
              session.clear()
              return redirect(url_for('index'))
            else:
              conn.close()
              return render_template("index.html", kadrolar=kadrolar, mesaj="Şifre hatalı, hesap silinemedi")


          else:
            return render_template("index.html", kadrolar=kadrolar, mesaj="Giriş yapmadan kayıt silinemez")



        if form_type == "tercih_ekle":
           if "kullanici_id" in session:
             kullanici_id = session["kullanici_id"]
             conn = get_db_connection()
             cursor = conn.cursor()
             cursor.execute("SELECT COUNT(*) FROM tercihler WHERE kullanici_id = ?", (kullanici_id,))
             tercih_sayisi=cursor.fetchone()[0]
             conn.close()
             if tercih_sayisi<10:
               tercih_sirasi=tercih_sayisi+1
               tercih = request.form.get("tercih")
               conn = get_db_connection()
               cursor = conn.cursor()
               cursor.execute("INSERT INTO tercihler (kullanici_id, tercih_sirasi, kadro) VALUES (?, ?, ?)",
                             (kullanici_id, tercih_sirasi, tercih))
               conn.commit()
               conn.close()
             else:
                return render_template("index.html", kadrolar=kadrolar, mesaj="10 tercih sınırına ulaştınız")
           else:
              return render_template("index.html", kadrolar=kadrolar, mesaj="Tercih eklemek için giriş yapın")
           return redirect(url_for('index'))

        if form_type == "tercih_guncelle":
           if "kullanici_id" in session:
             kullanici_id = session["kullanici_id"]
             tercih_sirasi_guncel = request.form.get("tercih_sirasi_guncel")
             yeni_tercih = request.form.get("yeni_tercih")
             conn = get_db_connection()
             cursor = conn.cursor()
             cursor.execute("UPDATE tercihler SET kadro = ? WHERE kullanici_id = ? AND tercih_sirasi = ? ", (yeni_tercih, kullanici_id, tercih_sirasi_guncel))
             conn.commit()
             conn.close()
           else:
               return render_template("index.html", kadrolar=kadrolar, mesaj="Tercih güncellemek için giriş yapın")
           return redirect(url_for('index'))
    #GET İŞLEMLERİ
    kullanici_id=session.get("kullanici_id")

    conn = get_db_connection()
    cursor = conn.cursor()
    if kullanici_id:
      cursor.execute("SELECT * FROM tercihler WHERE kullanici_id = ?", (kullanici_id,))
      kullanici_tercihleri = cursor.fetchall()

    else:
      kullanici_tercihleri=[]
    conn.close()


    return render_template("index.html", kadrolar=kadrolar, kullanici_tercihleri=kullanici_tercihleri, kullanici_id=kullanici_id, ad_soyad = session.get('ad_soyad'), hizmet_puani=session.get('hizmet_puani'))


@app.route("/kadro_detay/<kadro>")
def kadro_detay(kadro):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
      SELECT k.ad_soyad, k.hizmet_puani, t.tercih_sirasi
      FROM kullanicilar k
      JOIN tercihler t ON k.id = t.kullanici_id
      WHERE t.kadro = ?
      ORDER BY t.tercih_sirasi
    """, (kadro,))
    tercih_edenler = cursor.fetchall()
    conn.close()

    return render_template("kadro_detay.html", kadro=kadro, tercih_edenler=tercih_edenler)

if __name__ == "__main__":
    app.run(debug=True)