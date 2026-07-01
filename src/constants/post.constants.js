export const ActiveStatus = {
    false: "false",
    true: "true",
}

export const JobStatus = {
    "publish": "publish",
    "draft": "draft",
    "pending": "pending",
    "awaiting-payment": "awaiting-payment",
}

export const OrderStatus = {   
    "wc-completed": "wc-completed",
    "wc-on-hold": "wc-on-hold",
}


export const PostStatus = {
    ...JobStatus,
    ...OrderStatus,
    "wc_completed": "wc-completed",
    "wc_on_hold": "wc-on-hold",
    "auto_draft": "auto-draft",
    "inherit": "inherit",
}

export const PostMetaKey = {
    job_salary: "job_salary",
    job_max_salary: "job_max_salary",
    location2: "jobsearch_field_location_location2",
    location3: "jobsearch_field_location_location3",
    address: "jobsearch_field_location_address",
    lat: "jobsearch_field_location_lat",
    lng: "jobsearch_field_location_lng",
    views_count: "jobsearch_job_views_count",
    applications: "jobsearch_job_applicants_list",
    featured: "jobsearch_field_job_featured",
    bolum: "bolum",
    kariyer_seviyesi: "kariyer-seviyesi",
    deneyim: "deneyim",
    pozisyon: "pozisyon",
    cinsiyet: "cinsiyet",
    yas_araligi: "yas-araligi",
    surucu_belgesi: "surucu-belgesi",
    jobType: "job_type",
    jobSector: "job_sector",
}

export const PostJobType = {
    "Serbest Zaman": "Serbest Zaman",
    "Tam Zamanlı": "Tam Zamanlı",
    "Yarı Zamanlı": "Yarı Zamanlı",
    "Dönemlik": "Dönemlik"
}

export const jobTypeColor = {
    [PostJobType["Serbest Zaman"]]: "#f50",
    [PostJobType["Tam Zamanlı"]]: "#108ee9",
    [PostJobType["Yarı Zamanlı"]]: "#87d068",
    [PostJobType["Dönemlik"]]: "#cd201f",
    [PostJobType["undefined"]]: "magenta",
}