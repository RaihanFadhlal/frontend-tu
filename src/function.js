export default {
    UploadIcon(path, name) {
        return new URL(path + name,
            import.meta.url).href;
    },
    FormatOutputDate(date) {
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

        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${dayName}, ${day} ${month} ${year}`;
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
}