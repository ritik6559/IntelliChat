"use client"

import React, {useState} from 'react';
import {useMeetingsFilter} from "@/modules/meetings/hooks/use-meetings-filter";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import CommandSelect from "@/components/command-select";
import GeneratedAvatar from "@/components/generated-avatar";

const AgentIdFilters = () => {

    const [filters, setFilters] = useMeetingsFilter();

    const trpc = useTRPC();

    const [ agentSearch, setAgentSearch ] = useState<string>();

    const { data } = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch
        })
    )

    return (
        <CommandSelect
            className={"h-9"}
            placeholder={"Agent"}
            options={( data?.items ?? []).map((agent) => ({
                id: agent.id,
                value: agent.id,
                children: (
                    <div className={"flex ite gap-x-2"} >
                        <GeneratedAvatar
                            seed={agent.name}
                            variant={"bottsNeutral"}
                            className={"size-4"}
                        />
                        {agent.name}
                    </div>
                )
            }))}
            onSelect={(value) => setFilters({ agentId: value })}
            onSearch={setAgentSearch}
            value={filters.agentId ?? ""}
        />
    );
};

export default AgentIdFilters;
