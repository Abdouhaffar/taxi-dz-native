import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from "react-native";

const C = {
  bg: "#0f1117",
  card: "#1a1d27",
  cardBorder: "#2a2d3e",
  green: "#00b37e",
  greenDark: "#007a55",
  orange: "#f97316",
  dark: "#1a1a2e",
  text: "#ffffff",
  textMuted: "#94a3b8",
  textDim: "#4a5568",
};

export default function HomeScreen() {
  const [role, setRole] = useState(null);

  if (!role) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <View style={styles.hero}>
          <Text style={styles.emoji}>🚕</Text>
          <Text style={styles.title}>TaxiDZ</Text>
          <Text style={styles.subtitle}>تاكسي الجزائر — فاوض على سعرك</Text>
          <Text style={styles.flag}>🇩🇿 صُنع في الجزائر</Text>
        </View>

        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>أنا...</Text>

          <TouchableOpacity
            style={[styles.roleCard, { borderColor: C.green }]}
            onPress={() => setRole("passenger")}
          >
            <Text style={styles.roleEmoji}>🧑</Text>
            <View>
              <Text style={styles.roleTitle}>راكب</Text>
              <Text style={styles.roleDesc}>أبحث عن سيارة أجرة</Text>
            </View>
            <Text style={styles.roleArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, { borderColor: C.orange }]}
            onPress={() => setRole("driver")}
          >
            <Text style={styles.roleEmoji}>👨‍✈️</Text>
            <View>
              <Text style={styles.roleTitle}>سائق</Text>
              <Text style={styles.roleDesc}>أقدم خدمة النقل</Text>
            </View>
            <Text style={styles.roleArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return role === "passenger" ? <PassengerApp /> : <DriverApp />;
}

// ===== PASSENGER APP =====
function PassengerApp() {
  const [screen, setScreen] = useState("home");
  const [booking, setBooking] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  if (screen === "home") return <PassengerHome onBook={() => setScreen("booking")} />;
  if (screen === "booking") return <BookingScreen onBack={() => setScreen("home")} onNext={data => { setBooking(data); setScreen("negotiate"); }} />;
  if (screen === "negotiate") return <NegotiateScreen booking={booking} onBack={() => setScreen("booking")} onConfirm={data => { setBooking({ ...booking, ...data }); setScreen("searching"); }} />;
  if (screen === "searching") return <SearchingScreen booking={booking} onFound={d => { setSelectedDriver(d); setScreen("found"); }} />;
  if (screen === "found") return <DriverFoundScreen driver={selectedDriver} onStart={() => setScreen("ride")} onCancel={() => setScreen("home")} />;
  if (screen === "ride") return <RideScreen driver={selectedDriver} booking={booking} onEnd={() => setScreen("home")} />;
}

// ===== PASSENGER HOME =====
function PassengerHome({ onBook }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <View style={styles.homeHeader}>
        <View>
          <Text style={styles.locationLabel}>موقعك الحالي 📍</Text>
          <Text style={styles.locationText}>الجزائر العاصمة</Text>
        </View>
        <View style={styles.avatar}><Text style={{ fontSize: 22 }}>👤</Text></View>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={{ fontSize: 48 }}>🗺️</Text>
        <Text style={{ color: C.textMuted, marginTop: 8, fontSize: 13 }}>خريطة الجزائر</Text>
        <View style={styles.mapCar}><Text style={{ fontSize: 28 }}>🚕</Text></View>
      </View>

      <View style={styles.bookCard}>
        <Text style={styles.bookTitle}>إلى أين تريد الذهاب؟ 🚕</Text>
        <TouchableOpacity style={styles.destInput} onPress={onBook}>
          <View style={styles.dot} />
          <Text style={{ color: "#ffffff55", fontSize: 14 }}>إلى أين؟ اضغط للحجز...</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookBtn} onPress={onBook}>
          <Text style={styles.bookBtnText}>🚀 ابحث عن سيارة</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.promoBanner}>
        <View>
          <Text style={{ color: "#ffffff77", fontSize: 12 }}>ميزة حصرية</Text>
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16, marginTop: 2 }}>فاوض على السعر! 🤝</Text>
          <Text style={{ color: "#ffffff66", fontSize: 12, marginTop: 4 }}>أنت تحدد ما تريد دفعه</Text>
        </View>
        <Text style={{ fontSize: 44 }}>💰</Text>
      </View>
    </ScrollView>
  );
}

// ===== BOOKING SCREEN =====
function BookingScreen({ onBack, onNext }) {
  const [from, setFrom] = useState("الجزائر العاصمة - باب الزوار");
  const [to, setTo] = useState("");
  const [rideType, setRideType] = useState("economy");

  const types = [
    { id: "economy", label: "اقتصادي", icon: "🚗", price: "600-900 دج", time: "3 دق" },
    { id: "comfort", label: "مريح", icon: "🚙", price: "900-1400 دج", time: "5 دق" },
    { id: "xl", label: "XL كبير", icon: "🚐", price: "1200-1800 دج", time: "7 دق" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <View style={styles.screenHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={{ color: C.text, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>تفاصيل الرحلة</Text>
      </View>

      <View style={styles.mapPlaceholder}>
        <Text style={{ fontSize: 36 }}>🗺️</Text>
      </View>

      <View style={styles.inputCard}>
        <View style={[styles.inputRow, { backgroundColor: "#e6f9f322" }]}>
          <View style={[styles.dot, { backgroundColor: C.green }]} />
          <Text style={{ color: C.text, fontSize: 14, flex: 1, textAlign: "right" }}>{from}</Text>
        </View>
        <View style={[styles.inputRow, { backgroundColor: "#f9731622", marginTop: 10 }]}>
          <View style={[styles.dot, { backgroundColor: C.orange }]} />
          <Text style={{ color: to ? C.text : C.textMuted, fontSize: 14, flex: 1, textAlign: "right" }}>
            {to || "إلى أين؟ مثال: حيدرة، باب الوادي..."}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>نوع السيارة</Text>
        {types.map(t => (
          <TouchableOpacity key={t.id} onPress={() => setRideType(t.id)}
            style={[styles.typeCard, { borderColor: rideType === t.id ? C.green : C.cardBorder, backgroundColor: rideType === t.id ? "#00b37e15" : C.bg }]}>
            <Text style={{ fontSize: 28 }}>{t.icon}</Text>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={{ color: C.text, fontWeight: "700", fontSize: 14 }}>{t.label}</Text>
              <Text style={{ color: C.textMuted, fontSize: 12 }}>⏱ {t.time}</Text>
            </View>
            <Text style={{ color: rideType === t.id ? C.green : C.text, fontWeight: "800", fontSize: 13 }}>{t.price}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.bookBtn} onPress={() => onNext({ from, to: "حيدرة", rideType })}>
          <Text style={styles.bookBtnText}>التالي: تحديد السعر 💰</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ===== NEGOTIATE SCREEN =====
function NegotiateScreen({ booking, onBack, onConfirm }) {
  const base = { economy: 750, comfort: 1150, xl: 1500 }[booking.rideType] || 750;
  const [price, setPrice] = useState(base);
  const [mode, setMode] = useState("suggested");

  const suggestions = [
    { label: "اقتصادي 🟢", value: Math.round(base * 0.75), color: C.green },
    { label: "عادل 👍", value: Math.round(base * 0.85), color: "#3b82f6" },
    { label: "مقترح ⭐", value: base, color: C.dark },
    { label: "مميز 🔥", value: Math.round(base * 1.1), color: C.orange },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <View style={styles.screenHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={{ color: C.text, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>حدد سعرك 💰</Text>
      </View>

      <View style={styles.modeToggle}>
        {[{ id: "suggested", label: "✅ السعر المقترح" }, { id: "negotiate", label: "🤝 فاوض السعر" }].map(m => (
          <TouchableOpacity key={m.id} onPress={() => setMode(m.id)}
            style={[styles.modeBtn, { backgroundColor: mode === m.id ? C.dark : "transparent" }]}>
            <Text style={{ color: mode === m.id ? "#fff" : C.textMuted, fontWeight: "700", fontSize: 13 }}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {mode === "suggested" ? (
        <View style={styles.priceCard}>
          <Text style={{ color: C.textMuted, fontSize: 13, marginBottom: 8 }}>السعر المقترح</Text>
          <Text style={{ color: C.green, fontSize: 60, fontWeight: "900" }}>{base}</Text>
          <Text style={{ color: C.textMuted, fontSize: 18 }}>دينار جزائري</Text>
          <TouchableOpacity style={[styles.bookBtn, { marginTop: 20 }]} onPress={() => onConfirm({ price: base, negotiated: false })}>
            <Text style={styles.bookBtnText}>✅ قبول السعر — {base} دج</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.priceCard}>
            <Text style={{ color: C.textMuted, fontSize: 13 }}>سعرك المقترح</Text>
            <Text style={{ color: price < base * 0.6 ? C.red : C.text, fontSize: 60, fontWeight: "900" }}>{price}</Text>
            <Text style={{ color: C.textMuted, fontSize: 16, marginBottom: 16 }}>دينار جزائري</Text>
            {price < base * 0.6 && <Text style={{ color: C.red, fontSize: 12, marginBottom: 8 }}>⚠️ السعر منخفض جداً</Text>}
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.sectionTitle}>اقتراحات سريعة</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {suggestions.map((s, i) => (
                <TouchableOpacity key={i} onPress={() => setPrice(s.value)}
                  style={{ flex: 1, minWidth: "45%", padding: 12, borderRadius: 12, borderWidth: 2, borderColor: price === s.value ? s.color : C.cardBorder, backgroundColor: price === s.value ? s.color + "15" : C.bg, alignItems: "center" }}>
                  <Text style={{ color: price === s.value ? s.color : C.text, fontWeight: "800", fontSize: 15 }}>{s.value} دج</Text>
                  <Text style={{ color: C.textMuted, fontSize: 10, marginTop: 2 }}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.bookBtn, { marginTop: 16, backgroundColor: C.dark }]} onPress={() => onConfirm({ price, negotiated: true })}>
              <Text style={styles.bookBtnText}>🤝 إرسال العرض — {price} دج</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ===== SEARCHING SCREEN =====
function SearchingScreen({ booking, onFound }) {
  const [timer, setTimer] = useState(0);
  const [drivers, setDrivers] = useState([
    { id: 1, name: "كريم بن علي", rating: 4.9, car: "رونو سيمبول 2021", avatar: "👨‍✈️", status: "pending", offerPrice: null },
    { id: 2, name: "يوسف مزياني", rating: 4.7, car: "بيجو 301 2020", avatar: "🧔", status: "pending", offerPrice: null },
    { id: 3, name: "أمين شريف", rating: 4.8, car: "داسيا لوغان 2022", avatar: "👨‍🦱", status: "pending", offerPrice: null },
  ]);

  useState(() => {
    const t = setInterval(() => setTimer(p => {
      const next = p + 1;
      if (next === 4) setDrivers(prev => prev.map((d, i) => i === 0 ? { ...d, status: "accepted", offerPrice: booking.price } : d));
      if (next === 7) setDrivers(prev => prev.map((d, i) => i === 1 ? { ...d, status: "counter", offerPrice: Math.round(booking.price * 1.1) } : d));
      if (next === 10) setDrivers(prev => prev.map((d, i) => i === 2 ? { ...d, status: "accepted", offerPrice: booking.price } : d));
      return next;
    }), 1000);
    return () => clearInterval(t);
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <Text style={[styles.screenTitle, { marginBottom: 4 }]}>📡 ردود السائقين</Text>
      <Text style={{ color: C.textMuted, fontSize: 13, textAlign: "right", marginBottom: 20 }}>عرضك: {booking.price} دج · ⏱ {timer}ث</Text>

      {drivers.map(d => (
        <View key={d.id} style={[styles.driverCard, { borderColor: d.status === "accepted" ? C.green : d.status === "counter" ? C.orange : C.cardBorder, opacity: d.status === "pending" ? 0.5 : 1 }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              <View style={styles.driverAvatar}><Text style={{ fontSize: 22 }}>{d.avatar}</Text></View>
              <View>
                <Text style={{ color: C.text, fontWeight: "700", fontSize: 14 }}>{d.name}</Text>
                <Text style={{ color: C.textMuted, fontSize: 12 }}>⭐ {d.rating} · {d.car}</Text>
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              {d.status === "pending" && <Text style={{ color: C.textDim, fontSize: 12 }}>ينتظر...</Text>}
              {d.status === "accepted" && <Text style={{ color: C.green, fontWeight: "900", fontSize: 18 }}>{d.offerPrice} دج ✅</Text>}
              {d.status === "counter" && <Text style={{ color: C.orange, fontWeight: "900", fontSize: 18 }}>{d.offerPrice} دج 🤝</Text>}
            </View>
          </View>
          {(d.status === "accepted" || d.status === "counter") && (
            <TouchableOpacity style={[styles.bookBtn, { marginTop: 12 }]} onPress={() => onFound(d)}>
              <Text style={styles.bookBtnText}>✅ اختيار هذا السائق</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

// ===== DRIVER FOUND =====
function DriverFoundScreen({ driver, onStart, onCancel }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60, alignItems: "center" }}>
      <Text style={{ fontSize: 64, marginBottom: 12 }}>🎉</Text>
      <Text style={{ color: C.text, fontSize: 22, fontWeight: "900", marginBottom: 4 }}>تم قبول طلبك!</Text>
      <Text style={{ color: C.textMuted, fontSize: 14, marginBottom: 24 }}>السائق في طريقه إليك</Text>

      <View style={[styles.inputCard, { width: "100%" }]}>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <View style={styles.driverAvatar}><Text style={{ fontSize: 26 }}>{driver.avatar}</Text></View>
          <View>
            <Text style={{ color: C.text, fontWeight: "800", fontSize: 16 }}>{driver.name}</Text>
            <Text style={{ color: C.textMuted, fontSize: 13 }}>⭐ {driver.rating} · {driver.car}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
          <View style={{ flex: 1, backgroundColor: "#00b37e22", borderRadius: 12, padding: 12, alignItems: "center" }}>
            <Text style={{ color: C.green, fontSize: 22, fontWeight: "900" }}>{driver.offerPrice} دج</Text>
            <Text style={{ color: C.green, fontSize: 11 }}>السعر المتفق</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "#3b82f622", borderRadius: 12, padding: 12, alignItems: "center" }}>
            <Text style={{ color: "#3b82f6", fontSize: 22, fontWeight: "900" }}>~3</Text>
            <Text style={{ color: "#3b82f6", fontSize: 11 }}>دقائق للوصول</Text>
          </View>
        </View>

        <View style={{ backgroundColor: C.dark, borderRadius: 14, padding: 16, marginBottom: 16, alignItems: "center" }}>
          <Text style={{ color: "#ffffff66", fontSize: 12, marginBottom: 6 }}>رمز التحقق — أعطه للسائق</Text>
          <Text style={{ color: "#fff", fontSize: 36, fontWeight: "900", letterSpacing: 12 }}>4782</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: "#ef444422", borderRadius: 12, padding: 14, alignItems: "center" }} onPress={onCancel}>
            <Text style={{ color: C.red, fontWeight: "700" }}>❌ إلغاء</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bookBtn, { flex: 2, marginTop: 0 }]} onPress={onStart}>
            <Text style={styles.bookBtnText}>📱 تتبع الرحلة</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// ===== RIDE SCREEN =====
function RideScreen({ driver, booking, onEnd }) {
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState(0);

  if (done) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 80, alignItems: "center" }}>
        <Text style={{ fontSize: 72, marginBottom: 12 }}>🏁</Text>
        <Text style={{ color: C.text, fontSize: 24, fontWeight: "900", marginBottom: 20 }}>وصلت بسلام!</Text>
        <View style={[styles.inputCard, { width: "100%" }]}>
          <Text style={{ color: C.text, fontWeight: "700", textAlign: "center", marginBottom: 16 }}>قيّم رحلتك مع {driver.name}</Text>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 20 }}>
            {[1,2,3,4,5].map(s => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Text style={{ fontSize: 36, opacity: s <= rating ? 1 : 0.25 }}>⭐</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ backgroundColor: "#00b37e22", borderRadius: 14, padding: 16, marginBottom: 16, alignItems: "center" }}>
            <Text style={{ color: C.green, fontSize: 28, fontWeight: "900" }}>{driver.offerPrice} دج</Text>
            <Text style={{ color: C.green, fontSize: 13 }}>المبلغ المدفوع</Text>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={onEnd}>
            <Text style={styles.bookBtnText}>✅ إنهاء وتقييم</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <View style={styles.mapPlaceholder}>
        <Text style={{ fontSize: 48 }}>🗺️</Text>
        <Text style={{ color: C.textMuted, fontSize: 13, marginTop: 8 }}>الرحلة جارية...</Text>
      </View>
      <View style={styles.inputCard}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={{ backgroundColor: "#00b37e22", borderRadius: 12, padding: 10, alignItems: "center", flex: 1, marginLeft: 8 }}>
            <Text style={{ color: C.green, fontWeight: "800" }}>{booking.to}</Text>
            <Text style={{ color: C.green, fontSize: 11 }}>الوجهة</Text>
          </View>
          <View style={{ backgroundColor: C.dark, borderRadius: 12, padding: 10, alignItems: "center", flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: "800" }}>{driver.offerPrice} دج</Text>
            <Text style={{ color: "#ffffff66", fontSize: 11 }}>السعر</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 28 }}>{driver.avatar}</Text>
          <View>
            <Text style={{ color: C.text, fontWeight: "700" }}>{driver.name}</Text>
            <Text style={{ color: C.textMuted, fontSize: 12 }}>{driver.car}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={() => setDone(true)}>
          <Text style={styles.bookBtnText}>🏁 محاكاة الوصول</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ===== DRIVER APP =====
function DriverApp() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <View style={styles.homeHeader}>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <View style={[styles.avatar, { width: 52, height: 52 }]}><Text style={{ fontSize: 26 }}>👨‍✈️</Text></View>
          <View>
            <Text style={{ color: C.text, fontWeight: "800", fontSize: 16 }}>كريم بن علي</Text>
            <Text style={{ color: C.textMuted, fontSize: 12 }}>⭐ 4.9 · رونو سيمبول 2021</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setIsOnline(!isOnline)}
          style={{ width: 56, height: 28, borderRadius: 14, backgroundColor: isOnline ? C.green : C.cardBorder, justifyContent: "center", padding: 3 }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#fff", alignSelf: isOnline ? "flex-end" : "flex-start" }} />
        </TouchableOpacity>
      </View>

      {isOnline ? (
        <View style={[styles.inputCard, { borderColor: C.green + "44", borderWidth: 1 }]}>
          <Text style={{ color: C.green, fontWeight: "700", fontSize: 14, textAlign: "center", marginBottom: 16 }}>🟢 أنت متصل — تلقّي الطلبات</Text>
          <View style={[styles.driverCard, { borderColor: C.orange }]}>
            <Text style={{ color: C.text, fontWeight: "800", fontSize: 14, marginBottom: 8 }}>🔔 طلب جديد!</Text>
            <Text style={{ color: C.textMuted, fontSize: 13, marginBottom: 4 }}>📍 باب الزوار ← حيدرة</Text>
            <Text style={{ color: C.textMuted, fontSize: 13, marginBottom: 12 }}>💰 عرض الراكب: 700 دج (مقترح: 850)</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: "#ef444422", borderRadius: 12, padding: 12, alignItems: "center" }}>
                <Text style={{ color: C.red, fontWeight: "700" }}>❌ رفض</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.bookBtn, { flex: 2, marginTop: 0 }]}>
                <Text style={styles.bookBtnText}>✅ قبول 700 دج</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.inputCard, { alignItems: "center" }]}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>😴</Text>
          <Text style={{ color: C.text, fontWeight: "700", fontSize: 16, marginBottom: 8 }}>أنت غير متصل</Text>
          <Text style={{ color: C.textMuted, fontSize: 13, marginBottom: 16, textAlign: "center" }}>فعّل الاتصال لتلقّي طلبات الرحلات</Text>
          <TouchableOpacity style={styles.bookBtn} onPress={() => setIsOnline(true)}>
            <Text style={styles.bookBtnText}>🟢 تفعيل الاتصال</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Stats */}
      <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
        {[["💰", "4,550", "أرباح اليوم", "دج"], ["🚕", "3", "رحلات اليوم", "رحلة"]].map(([icon, val, label, unit], i) => (
          <View key={i} style={[styles.inputCard, { flex: 1, alignItems: "center", marginTop: 0 }]}>
            <Text style={{ fontSize: 24 }}>{icon}</Text>
            <Text style={{ color: C.green, fontWeight: "900", fontSize: 20, marginTop: 4 }}>{val}</Text>
            <Text style={{ color: C.textMuted, fontSize: 11 }}>{unit}</Text>
            <Text style={{ color: C.textDim, fontSize: 10, marginTop: 2 }}>{label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, justifyContent: "space-between", padding: 24, paddingTop: 60, paddingBottom: 40 },
  hero: { alignItems: "center" },
  emoji: { fontSize: 72, marginBottom: 12 },
  title: { fontSize: 36, fontWeight: "900", color: C.text },
  subtitle: { fontSize: 15, color: C.textMuted, marginTop: 6 },
  flag: { fontSize: 13, color: C.textDim, marginTop: 8 },
  roleContainer: { gap: 14 },
  roleLabel: { color: C.textMuted, fontSize: 14, textAlign: "center", marginBottom: 4 },
  roleCard: { backgroundColor: C.card, borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", gap: 16, borderWidth: 1 },
  roleEmoji: { fontSize: 40 },
  roleTitle: { color: C.text, fontWeight: "800", fontSize: 18 },
  roleDesc: { color: C.textMuted, fontSize: 13, marginTop: 2 },
  roleArrow: { color: C.textMuted, fontSize: 24, marginRight: "auto" },
  homeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  locationLabel: { color: C.textMuted, fontSize: 13 },
  locationText: { color: C.text, fontSize: 18, fontWeight: "800" },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.dark, alignItems: "center", justifyContent: "center" },
  mapPlaceholder: { height: 180, backgroundColor: C.card, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 16, borderWidth: 1, borderColor: C.cardBorder },
  mapCar: { position: "absolute", bottom: 20, right: 20 },
  bookCard: { backgroundColor: C.card, borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: C.cardBorder },
  bookTitle: { color: C.text, fontWeight: "800", fontSize: 16, marginBottom: 14, textAlign: "right" },
  destInput: { backgroundColor: C.dark, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.orange },
  bookBtn: { backgroundColor: C.green, borderRadius: 16, padding: 16, alignItems: "center", marginTop: 12 },
  bookBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  promoBanner: { backgroundColor: C.dark, borderRadius: 20, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  screenHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.card, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.cardBorder },
  screenTitle: { color: C.text, fontWeight: "800", fontSize: 18, textAlign: "right", flex: 1 },
  inputCard: { backgroundColor: C.card, borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: C.cardBorder },
  inputRow: { borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  sectionTitle: { color: C.text, fontWeight: "700", fontSize: 14, marginVertical: 14, textAlign: "right" },
  typeCard: { borderRadius: 14, borderWidth: 2, padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 8 },
  modeToggle: { backgroundColor: C.card, borderRadius: 18, padding: 6, flexDirection: "row", marginBottom: 16, borderWidth: 1, borderColor: C.cardBorder },
  modeBtn: { flex: 1, padding: 12, borderRadius: 14, alignItems: "center" },
  priceCard: { backgroundColor: C.card, borderRadius: 24, padding: 24, alignItems: "center", marginBottom: 14, borderWidth: 1, borderColor: C.cardBorder },
  driverCard: { backgroundColor: C.card, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1 },
  driverAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.dark, alignItems: "center", justifyContent: "center" },
});
