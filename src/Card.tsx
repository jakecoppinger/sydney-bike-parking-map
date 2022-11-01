import React from "react";
import { RawOverpassNode } from "./interfaces";

interface Props {
  item: RawOverpassNode;
}
function CommonDetails(props: { item: RawOverpassNode }) {
  const { item } = props;

  return (
    <div>
      <p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.openstreetmap.org/node/${item.id}`}
        >
          Additional details (OSM node {item.id})
        </a>
      </p>
    </div>
  );
}

export default function Card(props: Props) {
  const { item } = props;
  return (
    <div>
      <div
        style={{
          display: "flex",
          margin: "8px 0",
          flexDirection: "column",
        }}
      >
        <h2>
          Bicycle parking
          {item.tags?.capacity
            ? ` with capacity for ${item.tags.capacity} bikes.`
            : null}
          <br />
          {item.tags?.covered === 'yes'
            ? ` It is under cover.`
            : `It is not under cover.`}
           <br/>
          {item.tags?.lit === 'yes'
            ? ` It is illuminated.`
            : (item.tags?.lit === 'no' ? `It it not illuminate.` : null)}
          

          <br />
          {item.tags?.bicycle_parking ? (
            <p>
              The type of parking is "{item.tags.bicycle_parking}"{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://wiki.openstreetmap.org/wiki/Key:bicycle_parking"
              >
                (more details).
              </a>
            </p>
          ) : null}


        </h2>
        {/* <p style={{ marginLeft: 4 }}>{JSON.stringify(item, null, 2)}</p> */}

        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://geohack.toolforge.org/geohack.php?params=${item.lat};${item.lon}`}
          >
            Get Directions in your favourite map
          </a>
        </p>
        <CommonDetails item={item}></CommonDetails>
        {/* <p style={{marginLeft: 4}}>{item.Fulldescription}</p> */}
      </div>
    </div>
  );
}
