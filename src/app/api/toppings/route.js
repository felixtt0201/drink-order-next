// let toppings = [
//   { name: "無配料", price: 0 },
//   { name: "珍珠", price: 5 },
// ];
import supabase from "../../../../lib/supabase";

export async function GET() {
  const { data: toppings, error } = await supabase.from("toppings").select("*");
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  return new Response(JSON.stringify(toppings), { status: 200 });
}

export async function POST(request) {
  const { name, price } = await request.json();
  const { data, error } = await supabase
    .from("toppings")
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
    .from("toppings")
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
  const { data, error } = await supabase.from("toppings").delete().eq("id", id);
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  return new Response(JSON.stringify(data), { status: 200 });
}
