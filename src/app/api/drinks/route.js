import supabase from "../../../../lib/supabase";

export async function GET() {
  const { data: drinks, error } = await supabase.from("drinks").select();
  console.log("drinks: ", drinks);
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  return new Response(JSON.stringify(drinks), { status: 200 });
}

export async function POST(request) {
  const { name, price } = await request.json();
  const { data, error } = await supabase
    .from("drinks")
    .insert([{ name, price }]);
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  return new Response(JSON.stringify(data), { status: 201 });
}

export async function PUT(request) {
  const { id, name, price } = await request.json();
  const { data, error } = await supabase
    .from("drinks")
    .update({ name, price })
    .eq("id", id);
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const { data, error } = await supabase.from("drinks").delete().eq("id", id);
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  return new Response(JSON.stringify(data), { status: 200 });
}
