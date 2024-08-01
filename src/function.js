export default {
    UploadIcon(path, name) {
        return new URL(path + name,
            import.meta.url).href;
    },
    FormatOutputDate(date, type, source) {
        const days = [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu",
        ];
        const months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];

        if (source == 'api') {
            date = new Date(date);
        }

        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return type === 'simple' ?
            `${day} ${month} ${year}` :
            `${dayName}, ${day} ${month} ${year}`;
    },

    FormatDate(date) {
        return new Date(date)
            .toLocaleDateString("id-ID", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                timeZone: "Asia/Jakarta",
            })
            .split("/")
            .reverse()
            .join("-");
    },
    GenderFormat(gender) {
        if (gender === "Laki-laki") {
            return "M";
        } else if (gender === "Perempuan") {
            return "F";
        } else if (gender === "M") {
            return "Laki-laki";
        } else if (gender === "F") {
            return "Perempuan";
        } else {
            return gender;
        }
    },
    Tomorrow() {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        return today.toISOString().split("T")[0];
      },
}